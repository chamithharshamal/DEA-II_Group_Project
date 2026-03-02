package com.nsbm.group35.healthcare.common.exception;

import java.util.Map;

/**
 * Custom Exception thrown when data validation fails.
 * This exception can hold a map of field names to error messages.
 */
public class ValidationException extends RuntimeException {

    private final Map<String, String> errors;

    /**
     * Constructs a new ValidationException.
     *
     * @param message the main detail message.
     * @param errors  a map consisting of validation errors (field -> message).
     */
    public ValidationException(String message, Map<String, String> errors) {
        super(message);
        this.errors = errors;
    }

    /**
     * Gets the map of field validation errors.
     *
     * @return the validation errors map.
     */
    public Map<String, String> getErrors() {
        return errors;
    }
}
