package com.nsbm.group35.healthcare.labreport.model;

public class AuthResponseDTO {

    private String token;
    private String role;
    private LabTechnicianDTO user;

    public AuthResponseDTO(String token, String role, LabTechnicianDTO user) {
        this.token = token;
        this.role = role;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LabTechnicianDTO getUser() {
        return user;
    }

    public void setUser(LabTechnicianDTO user) {
        this.user = user;
    }
}
