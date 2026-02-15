package com.nsbm.group35.healthcare.staff.repository;

import com.nsbm.group35.healthcare.staff.model.Shift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShiftRepository extends JpaRepository<Shift, Long> {
    List<Shift> findByStaffId(Long staffId);
    List<Shift> findByDate(LocalDate date);
}