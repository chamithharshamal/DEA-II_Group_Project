package com.nsbm.group35.healthcare.labreport.controller;

import com.nsbm.group35.healthcare.labreport.model.LabReportRequestDTO;
import com.nsbm.group35.healthcare.labreport.model.LabReportResponseDTO;
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
    public ResponseEntity<List<LabReportResponseDTO>> getAllLabReports() {
        return ResponseEntity.ok(labReportService.getAllLabReports());
    }

    @GetMapping("/{reportId}")
    public ResponseEntity<LabReportResponseDTO> getLabReportById(@PathVariable String reportId) {
        Optional<LabReportResponseDTO> report = labReportService.getLabReportById(reportId);
        return report.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<LabReportResponseDTO> createLabReport(@RequestBody LabReportRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(labReportService.createLabReport(requestDTO));
    }

    @PutMapping("/{reportId}")
    public ResponseEntity<LabReportResponseDTO> updateLabReport(@PathVariable String reportId,
            @RequestBody LabReportRequestDTO requestDTO) {
        LabReportResponseDTO updatedReport = labReportService.updateLabReport(reportId, requestDTO);
        if (updatedReport != null) {
            return ResponseEntity.ok(updatedReport);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{reportId}")
    public ResponseEntity<Void> deleteLabReport(@PathVariable String reportId) {
        labReportService.deleteLabReport(reportId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<LabReportResponseDTO>> getLabReportsByPatientId(@PathVariable String patientId) {
        return ResponseEntity.ok(labReportService.getLabReportsByPatientId(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<LabReportResponseDTO>> getLabReportsByDoctorId(@PathVariable String doctorId) {
        return ResponseEntity.ok(labReportService.getLabReportsByDoctorId(doctorId));
    }

    @GetMapping("/test/{testType}")
    public ResponseEntity<List<LabReportResponseDTO>> getLabReportsByTestType(@PathVariable String testType) {
        return ResponseEntity.ok(labReportService.getLabReportsByTestType(testType));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<LabReportResponseDTO>> getLabReportsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(labReportService.getLabReportsByStatus(status));
    }

    @GetMapping("/patient/{patientId}/status/{status}")
    public ResponseEntity<List<LabReportResponseDTO>> getLabReportsByPatientIdAndStatus(
            @PathVariable String patientId, @PathVariable String status) {
        return ResponseEntity.ok(labReportService.getLabReportsByPatientIdAndStatus(patientId, status));
    }

    @PatchMapping("/{reportId}/status")
    public ResponseEntity<LabReportResponseDTO> updateLabReportStatus(@PathVariable String reportId,
            @RequestParam String status) {
        LabReportResponseDTO report = labReportService.updateLabReportStatus(reportId, status);
        if (report != null) {
            return ResponseEntity.ok(report);
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/{reportId}/results")
    public ResponseEntity<LabReportResponseDTO> submitLabReportResults(@PathVariable String reportId,
            @RequestParam String results,
            @RequestParam String normalRange) {
        LabReportResponseDTO report = labReportService.submitLabReportResults(reportId, results, normalRange);
        if (report != null) {
            return ResponseEntity.ok(report);
        }
        return ResponseEntity.notFound().build();
    }
}
