package com.nsbm.group35.healthcare.billing.dto;

public class BillingRequestDTO {
    private String appointmentId;
    private String patientId;
    private String doctorId;
    private double consultationFee;
    private double labTestFee;
    private double medicationFee;
    private double otherFee;
    private String paymentMethod;
    private String dueDate;
    private String remarks;
    // Getters and Setters
}

package com.nsbm.group35.healthcare.billing.dto;
public class BillingResponseDTO {
    private String billingId;
    private String appointmentId;
    private String patientId;
    private String doctorId;
    private double consultationFee;
    private double labTestFee;
    private double medicationFee;
    private double otherFee;
    private double totalAmount; // Calculated on the backend
    private String paymentStatus; // e.g., PENDING, PAID
    private String paymentMethod;
    private String billingDate; // Set on creation
    private String dueDate;
    private String remarks;
    // Getters and Setters
}