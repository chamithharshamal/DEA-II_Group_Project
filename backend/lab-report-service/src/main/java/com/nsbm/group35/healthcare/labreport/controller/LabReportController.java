package com.nsbm.group35.healthcare.labreport.controller;

import com.nsbm.group35.healthcare.labreport.model.LabReport;
import com.nsbm.group35.healthcare.labreport.service.LabReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/lab-reports")
public class LabReportController {

    @Autowired
    private LabReportService labReportService;

    @GetMapping
    public ResponseEntity<List<LabReport>> getAllLabReports() {
        List<LabReport> reports = labReportService.getAllLabReports();
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/{reportId}")
    public ResponseEntity<LabReport> getLabReportById(@PathVariable String reportId) {
        Optional<LabReport> report = labReportService.getLabReportById(reportId);
        return report.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<LabReport> createLabReport(@RequestBody LabReport labReport) {
        LabReport createdReport = labReportService.createLabReport(labReport);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReport);
    }

    @PutMapping("/{reportId}")
    public ResponseEntity<LabReport> updateLabReport(@PathVariable String reportId, @RequestBody LabReport labReport) {
        LabReport updatedReport = labReportService.updateLabReport(reportId, labReport);
        return ResponseEntity.ok(updatedReport);
    }

    @DeleteMapping("/{reportId}")
    public ResponseEntity<Void> deleteLabReport(@PathVariable String reportId) {
        labReportService.deleteLabReport(reportId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<LabReport>> getLabReportsByPatientId(@PathVariable String patientId) {
        List<LabReport> reports = labReportService.getLabReportsByPatientId(patientId);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<LabReport>> getLabReportsByDoctorId(@PathVariable String doctorId) {
        List<LabReport> reports = labReportService.getLabReportsByDoctorId(doctorId);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/test/{testType}")
    public ResponseEntity<List<LabReport>> getLabReportsByTestType(@PathVariable String testType) {
        List<LabReport> reports = labReportService.getLabReportsByTestType(testType);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<LabReport>> getLabReportsByStatus(@PathVariable String status) {
        List<LabReport> reports = labReportService.getLabReportsByStatus(status);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/patient/{patientId}/status/{status}")
    public ResponseEntity<List<LabReport>> getLabReportsByPatientIdAndStatus(
            @PathVariable String patientId, @PathVariable String status) {
        List<LabReport> reports = labReportService.getLabReportsByPatientIdAndStatus(patientId, status);
        return ResponseEntity.ok(reports);
    }

    @PatchMapping("/{reportId}/status")
    public ResponseEntity<LabReport> updateLabReportStatus(@PathVariable String reportId, 
                                                            @RequestParam String status) {
        LabReport report = labReportService.updateLabReportStatus(reportId, status);
        if (report != null) {
            return ResponseEntity.ok(report);
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/{reportId}/results")
    public ResponseEntity<LabReport> submitLabReportResults(@PathVariable String reportId, 
                                                            @RequestParam String results,
                                                            @RequestParam String normalRange) {
        LabReport report = labReportService.submitLabReportResults(reportId, results, normalRange);
        if (report != null) {
            return ResponseEntity.ok(report);
        }
        return ResponseEntity.notFound().build();
    }
}
