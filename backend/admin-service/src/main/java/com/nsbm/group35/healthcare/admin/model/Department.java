package com.nsbm.group35.healthcare.admin.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "departments")
public class Department {

    @Id
    private String departmentId;
    private String departmentName;
    private String description;

    public Department() {
    }

    public Department(String departmentId, String departmentName, String description) {
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.description = description;
    }

    public String getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(String departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
