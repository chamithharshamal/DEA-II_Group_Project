package com.nsbm.group35.healthcare.common.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Standard Error Response format to be used globally across all microservices.
 * It contains standard details like timestamp, HTTP status, the error message,
 * and the API path that encountered the error.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponse {

    /**
     * The time when the error occurred.
     */
    private LocalDateTime timestamp;

    /**
     * The HTTP status code of the error (e.g., 404 for Not Found).
     */
    private int status;

    /**
     * The type/name of the error (e.g., Not Found, Internal Server Error).
     */
    private String error;

    /**
     * A descriptive message explaining the error details.
     */
    private String message;

    /**
     * The URI path that was requested when the error occurred.
     */
    private String path;

    /**
     * Additional validation errors, mapped by field name.
     */
    private Map<String, String> validationErrors;
}
