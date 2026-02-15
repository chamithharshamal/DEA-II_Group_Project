package com.nsbm.group35.healthcare.labreport.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "lab_reports")
public class LabReport {

    @Id
    private String reportId;
    private String patientId;
    private String testName;
    private String testType;
    private String status;
    private String reportDate;
    private String results;
    private String normalRange;
    private String doctorId;
    private String notes;

    public LabReport() {
    }

    public LabReport(String reportId, String patientId, String testName, String testType, String status,
            String reportDate, String results, String normalRange, String doctorId, String notes) {
        this.reportId = reportId;
        this.patientId = patientId;
        this.testName = testName;
        this.testType = testType;
        this.status = status;
        this.reportDate = reportDate;
        this.results = results;
        this.normalRange = normalRange;
        this.doctorId = doctorId;
        this.notes = notes;
    }

    public String getReportId() {
        return reportId;
    }

    public void setReportId(String reportId) {
        this.reportId = reportId;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getReportDate() {
        return reportDate;
    }

    public void setReportDate(String reportDate) {
        this.reportDate = reportDate;
    }

    public String getResults() {
        return results;
    }

    public void setResults(String results) {
        this.results = results;
    }

    public String getNormalRange() {
        return normalRange;
    }

    public void setNormalRange(String normalRange) {
        this.normalRange = normalRange;
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
