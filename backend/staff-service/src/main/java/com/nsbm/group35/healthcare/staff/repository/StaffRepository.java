package com.nsbm.group35.healthcare.staff.repository;

import com.nsbm.group35.healthcare.staff.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
}