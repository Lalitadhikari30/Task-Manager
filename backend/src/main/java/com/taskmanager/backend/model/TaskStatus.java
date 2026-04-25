package com.taskmanager.backend.model;

/**
 * Represents the lifecycle status of a task.
 * Tasks move through: TODO -> IN_PROGRESS -> DONE
 */
public enum TaskStatus {
    TODO,
    IN_PROGRESS,
    DONE
}
