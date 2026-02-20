package com.nsbm.group35.healthcare.pharmacy.exception;

public class PrescriptionNotFoundException extends RuntimeException {

    public PrescriptionNotFoundException(Long id) {
        super("Prescription not found with id: " + id);
    }

    public PrescriptionNotFoundException(String message) {
        super(message);
    }
}
