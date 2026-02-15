package com.nsbm.group35.healthcare.staff.controller;

import com.nsbm.group35.healthcare.staff.dto.ShiftDTO;
import com.nsbm.group35.healthcare.staff.dto.StaffDTO;
import com.nsbm.group35.healthcare.staff.model.Shift;
import com.nsbm.group35.healthcare.staff.model.Staff;
import com.nsbm.group35.healthcare.staff.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    @Autowired
    private StaffService staffService;

    
    @PostMapping
    public ResponseEntity<Staff> addStaff(@RequestBody StaffDTO staffDTO) {
        return ResponseEntity.ok(staffService.addStaff(staffDTO));
    }

    // GET: List all Staff
    @GetMapping
    public List<Staff> getAllStaff() {
        return staffService.getAllStaff();
    }

    // GET: Staff by ID
    @GetMapping("/{id}")
    public ResponseEntity<Staff> getStaffById(@PathVariable Long id) {
        return staffService.getStaffById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT: Update Staff
    @PutMapping("/{id}")
    public ResponseEntity<Staff> updateStaff(@PathVariable Long id, @RequestBody StaffDTO staffDTO) {
        return ResponseEntity.ok(staffService.updateStaff(id, staffDTO));
    }

    // POST: Assign Shift
    @PostMapping("/shifts")
    public ResponseEntity<Shift> assignShift(@RequestBody ShiftDTO shiftDTO) {
        return ResponseEntity.ok(staffService.assignShift(shiftDTO));
    }

    // GET: Shifts by Staff
    @GetMapping("/{id}/shifts")
    public List<Shift> getShiftsByStaff(@PathVariable Long id) {
        return staffService.getShiftsByStaff(id);
    }

    // GET: Shifts by Date (e.g., /api/staff/shifts?date=2026-02-15)
    @GetMapping("/shifts")
    public List<Shift> getShiftsByDate(@RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return staffService.getShiftsByDate(date);
    }
}