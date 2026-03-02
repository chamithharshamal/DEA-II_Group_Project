package com.nsbm.group35.healthcare.labreport.service;

import com.nsbm.group35.healthcare.labreport.model.LabReport;
import com.nsbm.group35.healthcare.labreport.repository.LabReportRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LabReportService {

    private final LabReportRepository labReportRepository;

    public LabReportService(LabReportRepository labReportRepository) {
        this.labReportRepository = labReportRepository;
    }

    public List<LabReport> getAllLabReports() {
        return labReportRepository.findAll();
    }

    public Optional<LabReport> getLabReportById(String reportId) {
        return labReportRepository.findById(reportId);
    }

    public LabReport createLabReport(LabReport labReport) {
        return labReportRepository.save(labReport);
    }

    public LabReport updateLabReport(String reportId, LabReport labReport) {
        labReport.setReportId(reportId);
        return labReportRepository.save(labReport);
    }

    public void deleteLabReport(String reportId) {
        labReportRepository.deleteById(reportId);
    }

    public List<LabReport> getLabReportsByPatientId(String patientId) {
        return labReportRepository.findByPatientId(patientId);
    }

    public List<LabReport> getLabReportsByDoctorId(String doctorId) {
        return labReportRepository.findByDoctorId(doctorId);
    }

    public List<LabReport> getLabReportsByTestType(String testType) {
        return labReportRepository.findByTestType(testType);
    }

    public List<LabReport> getLabReportsByStatus(String status) {
        return labReportRepository.findByStatus(status);
    }

    public List<LabReport> getLabReportsByPatientIdAndStatus(String patientId, String status) {
        return labReportRepository.findByPatientIdAndStatus(patientId, status);
    }

    public LabReport updateLabReportStatus(String reportId, String status) {
        Optional<LabReport> labReport = labReportRepository.findById(reportId);
        if (labReport.isPresent()) {
            LabReport report = labReport.get();
            report.setStatus(status);
            return labReportRepository.save(report);
        }
        return null;
    }

    public LabReport submitLabReportResults(String reportId, String results, String normalRange) {
        Optional<LabReport> labReport = labReportRepository.findById(reportId);
        if (labReport.isPresent()) {
            LabReport report = labReport.get();
            report.setResults(results);
            report.setNormalRange(normalRange);
            report.setStatus("Completed");
            return labReportRepository.save(report);
        }
        return null;
    }
}
