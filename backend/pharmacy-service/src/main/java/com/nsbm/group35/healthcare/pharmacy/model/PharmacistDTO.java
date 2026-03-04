package com.nsbm.group35.healthcare.pharmacy.model;

import com.nsbm.group35.healthcare.pharmacy.entity.Pharmacist;

public class PharmacistDTO {

    private String email;
    private String name;
    private String token; // For returning the JWT after login

    public PharmacistDTO() {
    }

    public PharmacistDTO(Pharmacist pharmacist) {
        this.email = pharmacist.getEmail();
        this.name = pharmacist.getName();
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
