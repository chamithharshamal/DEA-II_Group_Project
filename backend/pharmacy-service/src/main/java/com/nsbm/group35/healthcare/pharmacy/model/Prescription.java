package com.nsbm.group35.healthcare.pharmacy.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientId;

    private boolean dispensed = false;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Medication> medications;

    // Getters and Setters
}

