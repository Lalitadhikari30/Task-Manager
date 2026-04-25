package com.taskmanager.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for authentication responses (both register and login).
 *
 * Notice: We send back the JWT token, email, fullName, and role
 * but NEVER the password. This is exactly why DTOs exist —
 * they let us control what gets exposed to the client.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;      // JWT token for subsequent API calls
    private String email;
    private String fullName;
    private String role;
}
