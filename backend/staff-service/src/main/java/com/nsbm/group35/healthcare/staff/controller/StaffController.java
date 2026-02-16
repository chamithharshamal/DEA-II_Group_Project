package com.nsbm.group35.healthcare.staff.controller;

import com.nsbm.group35.healthcare.staff.model.Shift;
import com.nsbm.group35.healthcare.staff.model.Staff;
import com.nsbm.group35.healthcare.staff.service.StaffService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    private final StaffService staffService;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    @GetMapping
    public List<Staff> getAllStaff() {
        return staffService.getAllStaff();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Staff> getStaffById(@PathVariable Long id) {
        return staffService.getStaffById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Staff addStaff(@RequestBody Staff staff) {
        return staffService.addStaff(staff);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Staff> updateStaff(@PathVariable Long id, @RequestBody Staff staff) {
        Staff updatedStaff = staffService.updateStaff(id, staff);
        if (updatedStaff != null) {
            return ResponseEntity.ok(updatedStaff);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/shifts")
    public Shift assignShift(@RequestBody Shift shift) {
        return staffService.assignShift(shift);
    }

    @GetMapping("/{id}/shifts")
    public List<Shift> getShiftsByStaff(@PathVariable Long id) {
        return staffService.getShiftsByStaff(id);
    }

    @GetMapping("/shifts")
    public List<Shift> getShiftsByDate(@RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return staffService.getShiftsByDate(date);
    }
}