package com.taskmanager.backend.repository;

import com.taskmanager.backend.model.Task;
import com.taskmanager.backend.model.TaskPriority;
import com.taskmanager.backend.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Task entity.
 *
 * Spring Data JPA reads these method names and auto-generates SQL:
 *
 *   findByUserId(1L)
 *     → SELECT * FROM tasks WHERE user_id = 1
 *
 *   findByUserIdAndStatus(1L, TaskStatus.TODO)
 *     → SELECT * FROM tasks WHERE user_id = 1 AND status = 'TODO'
 *
 * The naming convention is:
 *   findBy + FieldName + And/Or + FieldName + ...
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    /**
     * Get all tasks owned by a specific user.
     * This is the primary query — users should only see THEIR tasks.
     */
    List<Task> findByUserId(Long userId);

    /**
     * Filter tasks by user AND status.
     * Example: Show me all my "IN_PROGRESS" tasks.
     */
    List<Task> findByUserIdAndStatus(Long userId, TaskStatus status);

    /**
     * Filter tasks by user AND priority.
     * Example: Show me all my "HIGH" priority tasks.
     */
    List<Task> findByUserIdAndPriority(Long userId, TaskPriority priority);
}
