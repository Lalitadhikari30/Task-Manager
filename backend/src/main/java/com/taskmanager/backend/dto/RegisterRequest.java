package com.taskmanager.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for user registration requests.
 *
 * Validation annotations ensure the client sends valid data:
 *   @NotBlank → field cannot be null, empty, or whitespace
 *   @Email    → must be a valid email format
 *   @Size     → enforces min/max length
 *
 * If validation fails, Spring automatically returns a 400 Bad Request
 * with details about which fields are invalid.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;
}
