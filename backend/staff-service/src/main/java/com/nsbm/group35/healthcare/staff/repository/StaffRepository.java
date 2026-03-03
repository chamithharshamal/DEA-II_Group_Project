package com.nsbm.group35.healthcare.staff.repository;

import com.nsbm.group35.healthcare.staff.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
    List<Staff> findByRole(String role);
    List<Staff> findByDepartment(String department);
    Optional<Staff> findByEmail(String email);
}