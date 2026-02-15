package com.nsbm.group35.healthcare.labreport.model;package com.nsbm.group35.healthcare.labreport.model;



import jakarta.persistence.Entity;import jakarta.persistence.Entity;

import jakarta.persistence.Id;import jakarta.persistence.Id;

import jakarta.persistence.Table;import jakarta.persistence.Table;



@Entity@Entity

@Table(name = "lab_reports")@Table(name = "lab_reports")

public class LabReport {public class LabReport {



    @Id    @Id

    private String reportId;    private String reportId;

    private String patientId;    private String patientId;

    private String testName;    private String testName;

    private String testType;    private String testType;

    private String status;    private String status;

    private String reportDate;    private String reportDate;

    private String results;    private String results;

    private String normalRange;    private String normalRange;

    private String doctorId;    private String doctorId;

    private String notes;    private String notes;



    public LabReport() {    public LabReport() {

    }    }



    public LabReport(String reportId, String patientId, String testName, String testType, String status,    public LabReport(String reportId, String patientId, String testName, String testType, String status,

            String reportDate, String results, String normalRange, String doctorId, String notes) {            String reportDate, String results, String normalRange, String doctorId, String notes) {

        this.reportId = reportId;        this.reportId = reportId;

        this.patientId = patientId;        this.patientId = patientId;

        this.testName = testName;        this.testName = testName;

        this.testType = testType;        this.testType = testType;

        this.status = status;        this.status = status;

        this.reportDate = reportDate;        this.reportDate = reportDate;

        this.results = results;        this.results = results;

        this.normalRange = normalRange;        this.normalRange = normalRange;

        this.doctorId = doctorId;        this.doctorId = doctorId;

        this.notes = notes;        this.notes = notes;

    }    }



    public String getReportId() {    public String getReportId() {

        return reportId;        return reportId;

    }    }



    public void setReportId(String reportId) {    public void setReportId(String reportId) {

        this.reportId = reportId;        this.reportId = reportId;

    }    }



    public String getPatientId() {    public String getPatientId() {

        return patientId;        return patientId;

    }    }



    public void setPatientId(String patientId) {    public void setPatientId(String patientId) {

        this.patientId = patientId;        this.patientId = patientId;

    }    }



    public String getTestName() {    public String getTestName() {

        return testName;        return testName;

    }    }



    public void setTestName(String testName) {    public void setTestName(String testName) {

        this.testName = testName;        this.testName = testName;

    }    }



    public String getTestType() {    public String getTestType() {

        return testType;        return testType;

    }    }



    public void setTestType(String testType) {    public void setTestType(String testType) {

        this.testType = testType;        this.testType = testType;

    }    }



    public String getStatus() {    public String getStatus() {

        return status;        return status;

    }    }



    public void setStatus(String status) {    public void setStatus(String status) {

        this.status = status;        this.status = status;

    }    }



    public String getReportDate() {    public String getReportDate() {

        return reportDate;        return reportDate;

    }    }



    public void setReportDate(String reportDate) {    public void setReportDate(String reportDate) {

        this.reportDate = reportDate;        this.reportDate = reportDate;

    }    }



    public String getResults() {    public String getResults() {

        return results;        return results;

    }    }



    public void setResults(String results) {    public void setResults(String results) {

        this.results = results;        this.results = results;

    }    }



    public String getNormalRange() {    public String getNormalRange() {

        return normalRange;        return normalRange;

    }    }



    public void setNormalRange(String normalRange) {    public void setNormalRange(String normalRange) {

        this.normalRange = normalRange;        this.normalRange = normalRange;

    }    }



    public String getDoctorId() {    public String getDoctorId() {

        return doctorId;        return doctorId;

    }    }



    public void setDoctorId(String doctorId) {    public void setDoctorId(String doctorId) {

        this.doctorId = doctorId;        this.doctorId = doctorId;

    }    }



    public String getNotes() {    public String getNotes() {

        return notes;        return notes;

    }    }



    public void setNotes(String notes) {    public void setNotes(String notes) {

        this.notes = notes;        this.notes = notes;

    }    }

}}

