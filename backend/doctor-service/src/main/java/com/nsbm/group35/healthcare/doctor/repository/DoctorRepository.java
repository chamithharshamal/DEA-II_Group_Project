package com.nsbm.group35.healthcare.doctor.repository;

import com.nsbm.group35.healthcare.doctor.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, String> {

}
