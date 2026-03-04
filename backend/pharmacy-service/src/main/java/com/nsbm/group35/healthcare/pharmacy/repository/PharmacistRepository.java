package com.nsbm.group35.healthcare.pharmacy.repository;

import com.nsbm.group35.healthcare.pharmacy.entity.Pharmacist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PharmacistRepository extends JpaRepository<Pharmacist, String> {
    Optional<Pharmacist> findByEmail(String email);
}
