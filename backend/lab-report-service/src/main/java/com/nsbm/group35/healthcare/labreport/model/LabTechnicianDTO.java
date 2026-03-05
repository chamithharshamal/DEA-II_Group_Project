package com.nsbm.group35.healthcare.labreport.model;

public class LabTechnicianDTO {
    private String technicianId;
    private String name;
    private String email;
    private String phone;
    private String department;
    private String role;

    public LabTechnicianDTO() {
    }

    public LabTechnicianDTO(String technicianId, String name, String email, String phone, String department,
            String role) {
        this.technicianId = technicianId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.role = role;
    }

    public String getTechnicianId() {
        return technicianId;
    }

    public void setTechnicianId(String technicianId) {
        this.technicianId = technicianId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
