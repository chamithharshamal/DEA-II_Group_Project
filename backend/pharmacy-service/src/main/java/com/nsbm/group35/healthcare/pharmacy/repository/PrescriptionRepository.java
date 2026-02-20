package com.nsbm.group35.healthcare.pharmacy.repository;

import com.nsbm.group35.healthcare.pharmacy.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    List<Prescription> findByPatientId(String patientId);

    List<Prescription> findByPatientIdAndDispensed(String patientId, boolean dispensed);
}
