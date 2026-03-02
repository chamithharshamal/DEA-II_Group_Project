package com.nsbm.group35.healthcare.labreport.repository;

import com.nsbm.group35.healthcare.labreport.model.LabReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LabReportRepository extends JpaRepository<LabReport, String> {
    List<LabReport> findByPatientId(String patientId);
    List<LabReport> findByDoctorId(String doctorId);
    List<LabReport> findByTestType(String testType);
    List<LabReport> findByStatus(String status);
    List<LabReport> findByPatientIdAndStatus(String patientId, String status);
}
