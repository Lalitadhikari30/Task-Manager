package com.taskmanager.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO for creating or updating a task.
 *
 * Only the title is required — everything else has sensible defaults
 * set in the Task entity's @PrePersist method.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequest {

    @NotBlank(message = "Task title is required")
    private String title;

    private String description;    // Optional
    private String status;         // Optional — defaults to "TODO"
    private String priority;       // Optional — defaults to "MEDIUM"
    private LocalDate dueDate;     // Optional
}
