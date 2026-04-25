package com.taskmanager.backend.controller;

import com.taskmanager.backend.dto.TaskRequest;
import com.taskmanager.backend.dto.TaskResponse;
import com.taskmanager.backend.model.User;
import com.taskmanager.backend.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Task Controller — full CRUD operations for tasks.
 *
 * BASE URL: /api/tasks
 *
 * ALL endpoints require authentication (JWT token in Authorization header).
 *
 * Key annotation:
 *   @AuthenticationPrincipal User user
 *     → Spring Security automatically extracts the authenticated user
 *       from the SecurityContext (set by JwtAuthenticationFilter)
 *       and injects it as a method parameter. No manual parsing needed!
 *
 * HTTP Methods & Their Meanings:
 *   POST   → Create a new resource
 *   GET    → Read/retrieve resources
 *   PUT    → Full update of a resource (replace all fields)
 *   PATCH  → Partial update of a resource (change specific fields)
 *   DELETE → Remove a resource
 */
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    /**
     * Create a new task.
     *
     * POST /api/tasks
     * Headers: Authorization: Bearer <token>
     * Body: { "title": "Learn Spring Boot", "description": "...", "priority": "HIGH" }
     * Response: 201 Created + TaskResponse
     */
    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal User user) {
        TaskResponse response = taskService.createTask(request, user);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Get all tasks for the authenticated user.
     *
     * GET /api/tasks
     * Headers: Authorization: Bearer <token>
     * Response: 200 OK + List<TaskResponse>
     */
    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks(
            @AuthenticationPrincipal User user) {
        List<TaskResponse> tasks = taskService.getTasksByUser(user);
        return ResponseEntity.ok(tasks);
    }

    /**
     * Get a specific task by ID.
     *
     * GET /api/tasks/5
     * Headers: Authorization: Bearer <token>
     * Response: 200 OK + TaskResponse
     *
     * @PathVariable extracts the {id} from the URL path.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        TaskResponse response = taskService.getTaskById(id, user);
        return ResponseEntity.ok(response);
    }

    /**
     * Update a task (full update).
     *
     * PUT /api/tasks/5
     * Headers: Authorization: Bearer <token>
     * Body: { "title": "Updated Title", "status": "IN_PROGRESS", ... }
     * Response: 200 OK + TaskResponse
     */
    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal User user) {
        TaskResponse response = taskService.updateTask(id, request, user);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete a task.
     *
     * DELETE /api/tasks/5
     * Headers: Authorization: Bearer <token>
     * Response: 200 OK + confirmation message
     *
     * We return a Map to keep the response consistent with other endpoints.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTask(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        taskService.deleteTask(id, user);
        return ResponseEntity.ok(Map.of("message", "Task deleted successfully"));
    }

    /**
     * Update ONLY the status of a task.
     *
     * PATCH /api/tasks/5/status
     * Headers: Authorization: Bearer <token>
     * Body: { "status": "DONE" }
     * Response: 200 OK + TaskResponse
     *
     * PATCH is appropriate here because we're partially updating the resource
     * (only changing the status, not all fields).
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponse> updateTaskStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal User user) {
        TaskResponse response = taskService.updateTaskStatus(id, request.get("status"), user);
        return ResponseEntity.ok(response);
    }

    /**
     * Filter tasks by status or priority.
     *
     * GET /api/tasks/filter?status=TODO
     * GET /api/tasks/filter?priority=HIGH
     * Headers: Authorization: Bearer <token>
     * Response: 200 OK + List<TaskResponse>
     *
     * @RequestParam extracts query parameters from the URL.
     * 'required = false' means the parameter is optional.
     */
    @GetMapping("/filter")
    public ResponseEntity<List<TaskResponse>> filterTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @AuthenticationPrincipal User user) {

        List<TaskResponse> tasks;

        if (status != null) {
            tasks = taskService.filterByStatus(status, user);
        } else if (priority != null) {
            tasks = taskService.filterByPriority(priority, user);
        } else {
            // If no filter provided, return all tasks
            tasks = taskService.getTasksByUser(user);
        }

        return ResponseEntity.ok(tasks);
    }
}
