package com.nsbm.group35.healthcare.pharmacy.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "prescriptions")
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientId;
    private String doctorId;
    private LocalDate prescribedDate;
    private boolean dispensed = false;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "prescription_id")
    private List<Medication> medications;

    public Prescription() {
    }

    public Prescription(Long id, String patientId, String doctorId,
                        LocalDate prescribedDate, boolean dispensed,
                        List<Medication> medications) {
        this.id = id;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.prescribedDate = prescribedDate;
        this.dispensed = dispensed;
        this.medications = medications;
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
