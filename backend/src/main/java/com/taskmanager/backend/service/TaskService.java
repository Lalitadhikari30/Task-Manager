package com.taskmanager.backend.service;

import com.taskmanager.backend.dto.TaskRequest;
import com.taskmanager.backend.dto.TaskResponse;
import com.taskmanager.backend.exception.BadRequestException;
import com.taskmanager.backend.exception.ResourceNotFoundException;
import com.taskmanager.backend.model.Task;
import com.taskmanager.backend.model.TaskPriority;
import com.taskmanager.backend.model.TaskStatus;
import com.taskmanager.backend.model.User;
import com.taskmanager.backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Task Service — all business logic for task management.
 *
 * IMPORTANT SECURITY PATTERN:
 * Every method takes the authenticated User as a parameter.
 * This ensures users can ONLY access their OWN tasks.
 * We verify ownership before any read/update/delete operation.
 *
 * This pattern prevents "Insecure Direct Object Reference" (IDOR) attacks,
 * where a user could try to access other users' tasks by guessing IDs.
 */
@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    /**
     * Create a new task for the authenticated user.
     *
     * The task is automatically linked to the user via the @ManyToOne relationship.
     * Status and priority default to TODO and MEDIUM if not provided.
     */
    public TaskResponse createTask(TaskRequest request, User user) {
        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(parseStatus(request.getStatus()))
                .priority(parsePriority(request.getPriority()))
                .dueDate(request.getDueDate())
                .user(user)  // Link the task to the authenticated user
                .build();

        Task savedTask = taskRepository.save(task);
        return mapToResponse(savedTask);
    }

    /**
     * Get ALL tasks for the authenticated user.
     *
     * Uses Java Streams to convert a list of Task entities
     * into a list of TaskResponse DTOs.
     *
     * Stream pipeline:
     *   taskList.stream()        → creates a stream of Task objects
     *   .map(this::mapToResponse) → transforms each Task → TaskResponse
     *   .collect(toList())       → collects results back into a List
     */
    public List<TaskResponse> getTasksByUser(User user) {
        return taskRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get a specific task by ID — only if the authenticated user owns it.
     */
    public TaskResponse getTaskById(Long taskId, User user) {
        Task task = findTaskAndVerifyOwnership(taskId, user);
        return mapToResponse(task);
    }

    /**
     * Update a task — only if the authenticated user owns it.
     *
     * Only updates fields that are provided (non-null).
     * This allows partial updates — the client doesn't need to send ALL fields.
     */
    public TaskResponse updateTask(Long taskId, TaskRequest request, User user) {
        Task task = findTaskAndVerifyOwnership(taskId, user);

        // Update only the fields that were provided
        task.setTitle(request.getTitle());

        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getStatus() != null) {
            task.setStatus(parseStatus(request.getStatus()));
        }
        if (request.getPriority() != null) {
            task.setPriority(parsePriority(request.getPriority()));
        }
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }

        Task updatedTask = taskRepository.save(task); // JPA does UPDATE (not INSERT) since the entity has an ID
        return mapToResponse(updatedTask);
    }

    /**
     * Delete a task — only if the authenticated user owns it.
     */
    public void deleteTask(Long taskId, User user) {
        Task task = findTaskAndVerifyOwnership(taskId, user);
        taskRepository.delete(task);
    }

    /**
     * Update ONLY the status of a task.
     * This is a dedicated endpoint for status transitions: TODO → IN_PROGRESS → DONE
     */
    public TaskResponse updateTaskStatus(Long taskId, String status, User user) {
        Task task = findTaskAndVerifyOwnership(taskId, user);
        task.setStatus(parseStatus(status));
        Task updatedTask = taskRepository.save(task);
        return mapToResponse(updatedTask);
    }

    /**
     * Filter tasks by status (e.g., show only "IN_PROGRESS" tasks).
     */
    public List<TaskResponse> filterByStatus(String status, User user) {
        TaskStatus taskStatus = parseStatus(status);
        return taskRepository.findByUserIdAndStatus(user.getId(), taskStatus)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Filter tasks by priority (e.g., show only "HIGH" priority tasks).
     */
    public List<TaskResponse> filterByPriority(String priority, User user) {
        TaskPriority taskPriority = parsePriority(priority);
        return taskRepository.findByUserIdAndPriority(user.getId(), taskPriority)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // =====================================================
    // PRIVATE HELPER METHODS
    // =====================================================

    /**
     * Find a task by ID and verify that the authenticated user owns it.
     * This method is used by get/update/delete to enforce ownership.
     *
     * Throws:
     *   - ResourceNotFoundException if the task doesn't exist
     *   - BadRequestException if the user doesn't own the task
     */
    private Task findTaskAndVerifyOwnership(Long taskId, User user) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Task not found with id: " + taskId
                ));

        // SECURITY CHECK: Ensure the task belongs to the requesting user
        if (!task.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You don't have permission to access this task");
        }

        return task;
    }

    /**
     * Convert a Task entity → TaskResponse DTO.
     * This is where we control what data the client sees.
     * Notice: we send ownerEmail but NOT the password or user ID.
     */
    private TaskResponse mapToResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus().name())
                .priority(task.getPriority().name())
                .dueDate(task.getDueDate())
                .ownerEmail(task.getUser().getEmail())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }

    /**
     * Safely parse status string to enum.
     * Returns null if the input is null (lets @PrePersist set the default).
     */
    private TaskStatus parseStatus(String status) {
        if (status == null || status.isBlank()) return null;
        try {
            return TaskStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException(
                    "Invalid status: " + status + ". Must be one of: TODO, IN_PROGRESS, DONE"
            );
        }
    }

    /**
     * Safely parse priority string to enum.
     * Returns null if the input is null (lets @PrePersist set the default).
     */
    private TaskPriority parsePriority(String priority) {
        if (priority == null || priority.isBlank()) return null;
        try {
            return TaskPriority.valueOf(priority.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException(
                    "Invalid priority: " + priority + ". Must be one of: LOW, MEDIUM, HIGH"
            );
        }
    }
}
