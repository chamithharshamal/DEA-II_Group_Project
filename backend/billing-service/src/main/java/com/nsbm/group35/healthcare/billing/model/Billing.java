package com.nsbm.group35.healthcare.billing.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "billings")
public class Billing {

    @Id
    private String billingId;
    private String appointmentId;
    private String patientId;
    private String doctorId;
    private double consultationFee;
    private double labTestFee;
    private double medicationFee;
    private double otherFee;
    private double totalAmount;
    private String paymentStatus;
    private String paymentMethod;
    private String billingDate;
    private String dueDate;
    private String remarks;

    public Billing() {
    }

    public Billing(String billingId, String appointmentId, String patientId, String doctorId,
            double consultationFee, double labTestFee, double medicationFee, double otherFee,
            double totalAmount, String paymentStatus, String paymentMethod, String billingDate,
            String dueDate, String remarks) {
        this.billingId = billingId;
        this.appointmentId = appointmentId;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.consultationFee = consultationFee;
        this.labTestFee = labTestFee;
        this.medicationFee = medicationFee;
        this.otherFee = otherFee;
        this.totalAmount = totalAmount;
        this.paymentStatus = paymentStatus;
        this.paymentMethod = paymentMethod;
        this.billingDate = billingDate;
        this.dueDate = dueDate;
        this.remarks = remarks;
    }

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
