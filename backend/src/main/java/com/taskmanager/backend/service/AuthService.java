package com.taskmanager.backend.service;

import com.taskmanager.backend.dto.AuthResponse;
import com.taskmanager.backend.dto.LoginRequest;
import com.taskmanager.backend.dto.RegisterRequest;
import com.taskmanager.backend.exception.BadRequestException;
import com.taskmanager.backend.model.Role;
import com.taskmanager.backend.model.User;
import com.taskmanager.backend.repository.UserRepository;
import com.taskmanager.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Authentication Service — handles registration and login logic.
 *
 * REGISTRATION flow:
 *   1. Check if email already exists → throw BadRequestException if yes
 *   2. Hash the password using BCrypt (NEVER store plain text passwords)
 *   3. Save the user to the database
 *   4. Generate a JWT token
 *   5. Return AuthResponse with token + user info
 *
 * LOGIN flow:
 *   1. AuthenticationManager verifies email + password
 *      (internally uses CustomUserDetailsService + BCrypt)
 *   2. If credentials are wrong → throws BadCredentialsException
 *      (caught by GlobalExceptionHandler → returns 401)
 *   3. If correct → load the user, generate JWT, return AuthResponse
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    /**
     * Register a new user.
     */
    public AuthResponse register(RegisterRequest request) {

        // 1. Check for duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered: " + request.getEmail());
        }

        // 2. Build the user entity with hashed password
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) // BCrypt hash!
                .role(Role.USER)
                .build();

        // 3. Save to database (JPA generates the INSERT SQL)
        userRepository.save(user);

        // 4. Generate JWT token for immediate login after registration
        String token = jwtUtil.generateToken(user);

        // 5. Build and return the response
        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }

    /**
     * Login an existing user.
     */
    public AuthResponse login(LoginRequest request) {

        // 1. Authenticate using Spring Security's AuthenticationManager
        // This internally:
        //   - Calls CustomUserDetailsService.loadUserByUsername(email)
        //   - Compares the provided password with the stored BCrypt hash
        //   - Throws BadCredentialsException if mismatch
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // 2. If we reach here, authentication was successful
        // Load the user to build the response
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        // 3. Generate JWT token
        String token = jwtUtil.generateToken(user);

        // 4. Return response
        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }
}
