package com.nsbm.group35.healthcare.labreport.repository;

import com.nsbm.group35.healthcare.labreport.entity.LabTechnician;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LabTechnicianRepository extends JpaRepository<LabTechnician, String> {
    Optional<LabTechnician> findByEmail(String email);

    Optional<LabTechnician> findByTechnicianIdOrEmail(String technicianId, String email);
}
