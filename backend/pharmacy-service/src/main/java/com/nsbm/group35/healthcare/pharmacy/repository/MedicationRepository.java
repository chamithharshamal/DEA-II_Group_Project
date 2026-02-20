package com.nsbm.group35.healthcare.pharmacy.repository;

import com.nsbm.group35.healthcare.pharmacy.model.Medication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicationRepository extends JpaRepository<Medication, Long> {

    List<Medication> findByStockLessThan(int threshold);

    List<Medication> findByNameContainingIgnoreCase(String name);
}
