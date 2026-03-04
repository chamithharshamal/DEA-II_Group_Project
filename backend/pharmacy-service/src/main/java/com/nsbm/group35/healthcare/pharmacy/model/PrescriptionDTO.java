package com.nsbm.group35.healthcare.pharmacy.model;

import com.nsbm.group35.healthcare.pharmacy.entity.Medication;
import com.nsbm.group35.healthcare.pharmacy.entity.Prescription;

import java.time.LocalDate;
import java.util.List;

public class PrescriptionDTO {

    private Long id;
    private String patientId;
    private String doctorId;
    private LocalDate prescribedDate;
    private boolean dispensed;
    private List<Medication> medications;

    public PrescriptionDTO() {
    }

    public PrescriptionDTO(Prescription prescription) {
        this.id = prescription.getId();
        this.patientId = prescription.getPatientId();
        this.doctorId = prescription.getDoctorId();
        this.prescribedDate = prescription.getPrescribedDate();
        this.dispensed = prescription.isDispensed();
        this.medications = prescription.getMedications();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDate getPrescribedDate() {
        return prescribedDate;
    }

    public void setPrescribedDate(LocalDate prescribedDate) {
        this.prescribedDate = prescribedDate;
    }

    public boolean isDispensed() {
        return dispensed;
    }

    public void setDispensed(boolean dispensed) {
        this.dispensed = dispensed;
    }

    public List<Medication> getMedications() {
        return medications;
    }

    public void setMedications(List<Medication> medications) {
        this.medications = medications;
    }
}
