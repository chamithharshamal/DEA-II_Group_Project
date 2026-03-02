package com.nsbm.group35.healthcare.common.exception;

/**
 * Custom Exception thrown when a requested resource (like an entity by ID)
 * cannot be found in the database or service.
 */
public class ResourceNotFoundException extends RuntimeException {

    /**
     * Constructs a new ResourceNotFoundException with the specified detail message.
     *
     * @param message the detail message describing which resource wasn't found.
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
