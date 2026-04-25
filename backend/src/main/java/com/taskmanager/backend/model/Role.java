package com.taskmanager.backend.model;

/**
 * Defines user roles for authorization.
 * - USER: Standard user, can manage their own tasks
 * - ADMIN: Can manage all tasks and users (future use)
 */
public enum Role {
    USER,
    ADMIN
}
