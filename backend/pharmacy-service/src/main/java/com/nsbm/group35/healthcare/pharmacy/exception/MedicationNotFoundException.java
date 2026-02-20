package com.nsbm.group35.healthcare.pharmacy.exception;

public class MedicationNotFoundException extends RuntimeException {

    public MedicationNotFoundException(Long id) {
        super("Medication not found with id: " + id);
    }

    public MedicationNotFoundException(String message) {
        super(message);
    }
}
