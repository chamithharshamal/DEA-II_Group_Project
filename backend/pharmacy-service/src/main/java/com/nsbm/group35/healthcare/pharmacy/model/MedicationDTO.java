package com.nsbm.group35.healthcare.pharmacy.model;

import com.nsbm.group35.healthcare.pharmacy.entity.Medication;

public class MedicationDTO {

    private Long id;
    private String name;
    private String description;
    private int stock;
    private double price;
    private int quantity;

    public MedicationDTO() {
    }

    public MedicationDTO(Medication medication) {
        this.id = medication.getId();
        this.name = medication.getName();
        this.description = medication.getDescription();
        this.stock = medication.getStock();
        this.price = medication.getPrice();
        this.quantity = medication.getQuantity();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
