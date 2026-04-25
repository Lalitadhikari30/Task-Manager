package com.taskmanager.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Task entity — maps to the "tasks" table in MySQL.
 *
 * Each task belongs to a User (Many-to-One relationship).
 * The @ManyToOne annotation creates a foreign key column "user_id"
 * in the tasks table that references the users table.
 *
 * Relationship explained:
 *   ONE User can have MANY Tasks
 *   MANY Tasks belong to ONE User
 *   → Task is the "owning side" of the relationship
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT") // TEXT type for longer descriptions
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskPriority priority;

    private LocalDate dueDate; // Optional — tasks may not have a deadline

    /**
     * Many-to-One relationship with User.
     * - FetchType.LAZY: Don't load the User object until it's actually accessed.
     *   This improves performance when you only need task data.
     * - @JoinColumn: Creates a "user_id" column in the tasks table.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    /**
     * Automatically called before INSERT.
     * Sets creation timestamp and default status/priority.
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = TaskStatus.TODO; // New tasks start as TODO
        }
        if (this.priority == null) {
            this.priority = TaskPriority.MEDIUM; // Default priority
        }
    }

    /**
     * Automatically called before UPDATE.
     * Refreshes the updatedAt timestamp.
     */
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
