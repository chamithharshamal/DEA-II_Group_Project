package com.nsbm.group35.healthcare.labreport.model;

public class LabReportRequestDTO {
    private String patientId;
    private String testName;
    private String testType;
    private String doctorId;
    private String notes;

    public LabReportRequestDTO() {
    }

    public LabReportRequestDTO(String patientId, String testName, String testType, String doctorId, String notes) {
        this.patientId = patientId;
        this.testName = testName;
        this.testType = testType;
        this.doctorId = doctorId;
        this.notes = notes;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getTestName() {
        return testName;
    }

    public void setTestName(String testName) {
        this.testName = testName;
    }

    public String getTestType() {
        return testType;
    }

    public void setTestType(String testType) {
        this.testType = testType;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
