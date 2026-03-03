package com.nsbm.group35.healthcare.staff.repository;

import com.nsbm.group35.healthcare.staff.entity.Shift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ShiftRepository extends JpaRepository<Shift, Long> {
    List<Shift> findByStaff_StaffId(Long staffId);

    @Query("SELECT s FROM Shift s WHERE s.startTime >= :start AND s.startTime < :end")
    List<Shift> findShiftsByDate(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}