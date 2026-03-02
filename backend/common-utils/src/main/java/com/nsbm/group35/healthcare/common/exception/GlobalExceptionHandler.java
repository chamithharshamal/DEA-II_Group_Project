package com.nsbm.group35.healthcare.common.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;

/**
 * Global Exception Handler for capturing exceptions thrown across all controllers.
 * It provides a centralized way to handle exceptions and return meaningful,
 * standardized ErrorResponse objects to the API clients.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles ResourceNotFoundException to return a 404 Not Found response.
     *
     * @param ex      the captured ResourceNotFoundException.
     * @param request the current web request details.
     * @return a ResponseEntity containing the standard ErrorResponse.
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        log.error("Resource not found: {}", ex.getMessage());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.NOT_FOUND.value())
                .error(HttpStatus.NOT_FOUND.getReasonPhrase())
                .message(ex.getMessage())
                .path(request.getDescription(false).replace("uri=", ""))
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    /**
     * Handles ValidationException to return a 400 Bad Request response with validation details.
     *
     * @param ex      the captured ValidationException.
     * @param request the current web request details.
     * @return a ResponseEntity containing the standard ErrorResponse with field errors.
     */
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(ValidationException ex, WebRequest request) {
        log.error("Validation error: {}", ex.getMessage());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .message(ex.getMessage())
                .path(request.getDescription(false).replace("uri=", ""))
                .validationErrors(ex.getErrors())
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    /**
     * Fallback handler for any other unhandled Exceptions, returning a 500 Internal Server Error.
     *
     * @param ex      the generic Exception.
     * @param request the current web request details.
     * @return a ResponseEntity containing the standard ErrorResponse.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex, WebRequest request) {
        log.error("An unexpected error occurred: ", ex);

        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
                .message("An unexpected internal error occurred")
                .path(request.getDescription(false).replace("uri=", ""))
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
