package com.taskmanager.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Thrown when a requested resource (task, user, etc.) doesn't exist.
 *
 * @ResponseStatus(NOT_FOUND) tells Spring to return HTTP 404 automatically
 * if this exception reaches the framework without being caught.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
