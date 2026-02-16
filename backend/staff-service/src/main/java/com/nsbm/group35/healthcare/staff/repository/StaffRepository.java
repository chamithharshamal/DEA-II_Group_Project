package com.nsbm.group35.healthcare.staff.repository;

import com.nsbm.group35.healthcare.staff.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
    List<Staff> findByRole(String role);
    List<Staff> findByDepartment(String department);
}