package com.taskmanager.backend.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Standard error response DTO.
 *
 * Every error response from our API will have this consistent shape:
 * {
 *   "timestamp": "2024-01-15 10:30:00",
 *   "status": 404,
 *   "error": "Not Found",
 *   "message": "Task not found with id: 5",
 *   "path": "/api/tasks/5"
 * }
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;

    private int status;
    private String error;
    private String message;
    private String path;
}
