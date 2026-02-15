package com.nsbm.group35.healthcare.pharmacy.model;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
public class Medication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private int stock;
    private double price;

    // Getters and Setters
}
