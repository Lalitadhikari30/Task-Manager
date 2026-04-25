package com.taskmanager.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for task responses sent to the client.
 *
 * Includes the owner's email (so the client knows whose task it is)
 * but NOT the full User object (which would expose password, etc.).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {

    private Long id;
    private String title;
    private String description;
    private String status;
    private String priority;
    private LocalDate dueDate;
    private String ownerEmail;     // Just the email, not the entire User object
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
