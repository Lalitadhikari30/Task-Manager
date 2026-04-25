package com.taskmanager.backend.repository;

import com.taskmanager.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for User entity.
 *
 * Extends JpaRepository<User, Long> which gives us FREE methods:
 *   - save(user)          → INSERT or UPDATE
 *   - findById(id)        → SELECT by primary key
 *   - findAll()           → SELECT all
 *   - deleteById(id)      → DELETE by primary key
 *   - count()             → COUNT(*)
 *   ... and many more!
 *
 * We add custom query methods below using Spring Data's
 * "query derivation" — Spring reads the method name and
 * auto-generates the SQL. No implementation needed!
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find a user by their email address.
     * Generated SQL: SELECT * FROM users WHERE email = ?
     *
     * Returns Optional to safely handle "user not found" cases
     * instead of returning null (which can cause NullPointerException).
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if a user with the given email already exists.
     * Generated SQL: SELECT COUNT(*) > 0 FROM users WHERE email = ?
     *
     * Used during registration to prevent duplicate accounts.
     */
    boolean existsByEmail(String email);
}
