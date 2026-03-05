package com.nsbm.group35.healthcare.labreport.service;

import com.nsbm.group35.healthcare.labreport.entity.LabReport;
import com.nsbm.group35.healthcare.labreport.model.LabReportRequestDTO;
import com.nsbm.group35.healthcare.labreport.model.LabReportResponseDTO;
import com.nsbm.group35.healthcare.labreport.repository.LabReportRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

@Service
public class LabReportService {

    private final LabReportRepository labReportRepository;

    public LabReportService(LabReportRepository labReportRepository) {
        this.labReportRepository = labReportRepository;
    }

    public List<LabReportResponseDTO> getAllLabReports() {
        return labReportRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<LabReportResponseDTO> getLabReportById(String reportId) {
        return labReportRepository.findById(reportId).map(this::convertToResponseDTO);
    }

    public LabReportResponseDTO createLabReport(LabReportRequestDTO requestDTO) {
        LabReport report = new LabReport();
        report.setReportId("REP_" + UUID.randomUUID().toString().substring(0, 8)); // Generate simple unique ID
        report.setPatientId(requestDTO.getPatientId());
        report.setTestName(requestDTO.getTestName());
        report.setTestType(requestDTO.getTestType());
        report.setStatus("PENDING");
        report.setReportDate(LocalDateTime.now().toString());
        report.setDoctorId(requestDTO.getDoctorId());
        report.setNotes(requestDTO.getNotes());

        LabReport savedReport = labReportRepository.save(report);
        return convertToResponseDTO(savedReport);
    }

    public LabReportResponseDTO updateLabReport(String reportId, LabReportRequestDTO requestDTO) {
        Optional<LabReport> existingOpt = labReportRepository.findById(reportId);
        if (existingOpt.isPresent()) {
            LabReport report = existingOpt.get();
            report.setPatientId(requestDTO.getPatientId());
            report.setTestName(requestDTO.getTestName());
            report.setTestType(requestDTO.getTestType());
            report.setDoctorId(requestDTO.getDoctorId());
            report.setNotes(requestDTO.getNotes());
            return convertToResponseDTO(labReportRepository.save(report));
        }
        return null;
    }

    public void deleteLabReport(String reportId) {
        labReportRepository.deleteById(reportId);
    }

    public List<LabReportResponseDTO> getLabReportsByPatientId(String patientId) {
        return labReportRepository.findByPatientId(patientId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<LabReportResponseDTO> getLabReportsByDoctorId(String doctorId) {
        return labReportRepository.findByDoctorId(doctorId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<LabReportResponseDTO> getLabReportsByTestType(String testType) {
        return labReportRepository.findByTestType(testType).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<LabReportResponseDTO> getLabReportsByStatus(String status) {
        return labReportRepository.findByStatus(status).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<LabReportResponseDTO> getLabReportsByPatientIdAndStatus(String patientId, String status) {
        return labReportRepository.findByPatientIdAndStatus(patientId, status).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public LabReportResponseDTO updateLabReportStatus(String reportId, String status) {
        Optional<LabReport> labReport = labReportRepository.findById(reportId);
        if (labReport.isPresent()) {
            LabReport report = labReport.get();
            report.setStatus(status.toUpperCase());
            return convertToResponseDTO(labReportRepository.save(report));
        }
        return null;
    }

    public LabReportResponseDTO submitLabReportResults(String reportId, String results, String normalRange) {
        Optional<LabReport> labReport = labReportRepository.findById(reportId);
        if (labReport.isPresent()) {
            LabReport report = labReport.get();
            report.setResults(results);
            report.setNormalRange(normalRange);
            report.setStatus("COMPLETED");
            return convertToResponseDTO(labReportRepository.save(report));
        }
        return null;
    }

    private LabReportResponseDTO convertToResponseDTO(LabReport report) {
        LabReportResponseDTO dto = new LabReportResponseDTO();
        dto.setReportId(report.getReportId());
        dto.setPatientId(report.getPatientId());
        dto.setTestName(report.getTestName());
        dto.setTestType(report.getTestType());
        dto.setStatus(report.getStatus());
        dto.setReportDate(report.getReportDate());
        dto.setResults(report.getResults());
        dto.setNormalRange(report.getNormalRange());
        dto.setDoctorId(report.getDoctorId());
        dto.setNotes(report.getNotes());
        return dto;
    }
}
