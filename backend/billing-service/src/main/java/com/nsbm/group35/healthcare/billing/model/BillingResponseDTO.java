package com.nsbm.group35.healthcare.billing.model;

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
    public String getBillingId() {
        return billingId;
    }

    public void setBillingId(String billingId) {
        this.billingId = billingId;
    }

    public String getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(String appointmentId) {
        this.appointmentId = appointmentId;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public double getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(double consultationFee) {
        this.consultationFee = consultationFee;
    }

    public double getLabTestFee() {
        return labTestFee;
    }

    public void setLabTestFee(double labTestFee) {
        this.labTestFee = labTestFee;
    }

    public double getMedicationFee() {
        return medicationFee;
    }

    public void setMedicationFee(double medicationFee) {
        this.medicationFee = medicationFee;
    }

    public double getOtherFee() {
        return otherFee;
    }

    public void setOtherFee(double otherFee) {
        this.otherFee = otherFee;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getBillingDate() {
        return billingDate;
    }

    public void setBillingDate(String billingDate) {
        this.billingDate = billingDate;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
