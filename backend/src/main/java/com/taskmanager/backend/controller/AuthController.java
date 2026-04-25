package com.taskmanager.backend.controller;

import com.taskmanager.backend.dto.AuthResponse;
import com.taskmanager.backend.dto.LoginRequest;
import com.taskmanager.backend.dto.RegisterRequest;
import com.taskmanager.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Authentication Controller — handles user registration and login.
 *
 * BASE URL: /api/auth
 *
 * These endpoints are PUBLIC (configured in SecurityConfig.java):
 *   POST /api/auth/register → Create a new user account
 *   POST /api/auth/login    → Login and receive a JWT token
 *
 * Key annotations:
 *   @RestController    → Combines @Controller + @ResponseBody
 *                        (every method returns JSON, not a view)
 *   @RequestMapping    → Base URL prefix for all methods in this class
 *   @PostMapping       → Maps HTTP POST requests to this method
 *   @RequestBody       → Tells Spring to parse the JSON body into a Java object
 *   @Valid             → Triggers bean validation (@NotBlank, @Email, etc.)
 *                        If validation fails → MethodArgumentNotValidException
 *                        → caught by GlobalExceptionHandler → returns 400
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Register a new user.
     *
     * Request:  POST /api/auth/register
     * Body:     { "fullName": "John", "email": "john@email.com", "password": "pass123" }
     * Response: 201 Created + { "token": "eyJ...", "email": "...", "fullName": "...", "role": "USER" }
     *
     * HttpStatus.CREATED (201) is more appropriate than 200 OK
     * because we're creating a new resource (the user).
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Login an existing user.
     *
     * Request:  POST /api/auth/login
     * Body:     { "email": "john@email.com", "password": "pass123" }
     * Response: 200 OK + { "token": "eyJ...", "email": "...", "fullName": "...", "role": "USER" }
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
