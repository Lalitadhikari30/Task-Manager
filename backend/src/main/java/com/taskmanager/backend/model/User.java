package com.taskmanager.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

/**
 * User entity — maps to the "users" table in MySQL.
 *
 * Implements UserDetails so Spring Security can use this class
 * directly for authentication and authorization.
 *
 * Lombok annotations:
 *   @Data       → generates getters, setters, toString, equals, hashCode
 *   @Builder    → enables the builder pattern: User.builder().email("...").build()
 *   @NoArgsConstructor → generates a no-args constructor (required by JPA)
 *   @AllArgsConstructor → generates a constructor with all fields
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")  // "user" is a reserved keyword in MySQL, so we use "users"
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment ID
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true) // No two users can have the same email
    private String email;

    @Column(nullable = false)
    private String password; // Will store BCrypt-hashed password, never plain text

    @Enumerated(EnumType.STRING) // Store as "USER" or "ADMIN" string in DB
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false, updatable = false) // Set once at creation, never updated
    private LocalDateTime createdAt;

    /**
     * Called automatically before persisting to DB.
     * Sets createdAt timestamp and default role.
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.role == null) {
            this.role = Role.USER; // Default role
        }
    }

    // =====================================================
    // UserDetails interface methods (required by Spring Security)
    // =====================================================

    /**
     * Returns the authorities (roles) granted to the user.
     * Spring Security uses this to check authorization (e.g., hasRole("ADMIN")).
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    /**
     * Spring Security uses "username" for authentication.
     * In our app, the email IS the username.
     */
    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // We don't implement account expiration
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // We don't implement account locking
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // We don't implement credential expiration
    }

    @Override
    public boolean isEnabled() {
        return true; // All accounts are enabled by default
    }
}
