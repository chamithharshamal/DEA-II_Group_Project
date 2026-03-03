package com.nsbm.group35.healthcare.staff.controller;

import com.nsbm.group35.healthcare.staff.model.LoginRequest;
import com.nsbm.group35.healthcare.staff.model.ShiftDTO;
import com.nsbm.group35.healthcare.staff.model.StaffDTO;
import com.nsbm.group35.healthcare.staff.service.StaffService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Controller for managing Staff and their Shifts.
 * Handles authentication and CRUD operations.
 */
@Slf4j
@RestController
@RequestMapping("/api/staff")
public class StaffController {

    private final StaffService staffService;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    /**
     * Authenticates a staff member using email and password.
     *
     * @param loginRequest DTO containing email and password.
     * @return A map containing the JWT token if successful.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        log.info("Attempting login for staff email: {}", loginRequest.getEmail());
        try {
            String token = staffService.login(loginRequest.getEmail(), loginRequest.getPassword());
            log.info("Login successful for staff email: {}", loginRequest.getEmail());
            return ResponseEntity.ok(Map.of("token", token));
        } catch (RuntimeException e) {
            log.error("Login failed for staff: {}", e.getMessage());
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Retrieves all staff members.
     *
     * @return List of StaffDTO.
     */
    @GetMapping
    public List<StaffDTO> getAllStaff() {
        log.info("Fetching all staff members");
        return staffService.getAllStaff();
    }

    /**
     * Retrieves a specific staff member by ID.
     *
     * @param id The ID of the staff.
     * @return staff details.
     */
    @GetMapping("/{id}")
    public ResponseEntity<StaffDTO> getStaffById(@PathVariable Long id) {
        log.info("Fetching staff with ID: {}", id);
        return staffService.getStaffById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Adds a new staff member.
     *
     * @param staffDTO The staff details.
     * @return The created staff.
     */
    @PostMapping
    public StaffDTO addStaff(@RequestBody StaffDTO staffDTO) {
        log.info("Adding new staff with email: {}", staffDTO.getEmail());
        return staffService.addStaff(staffDTO);
    }

    /**
     * Updates an existing staff member.
     *
     * @param id       The ID of the staff to update.
     * @param staffDTO The updated details.
     * @return The updated staff details.
     */
    @PutMapping("/{id}")
    public ResponseEntity<StaffDTO> updateStaff(@PathVariable Long id, @RequestBody StaffDTO staffDTO) {
        log.info("Updating staff with ID: {}", id);
        try {
            return ResponseEntity.ok(staffService.updateStaff(id, staffDTO));
        } catch (RuntimeException e) {
            log.warn("Staff ID: {} not found for update", id);
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Deletes a staff member.
     *
     * @param id The ID of the staff to delete.
     * @return No content.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStaff(@PathVariable Long id) {
        log.info("Deleting staff with ID: {}", id);
        staffService.deleteStaff(id);
        return ResponseEntity.noContent().build();
    }

    // --- Shift Endpoints ---

    /**
     * Assigns a shift to a staff member.
     *
     * @param shiftDTO The shift details.
     * @return The created shift.
     */
    @PostMapping("/shifts")
    public ShiftDTO assignShift(@RequestBody ShiftDTO shiftDTO) {
        log.info("Assigning shift for staff ID: {}", shiftDTO.getStaffId());
        return staffService.assignShift(shiftDTO);
    }

    /**
     * Retrieves all shifts for a specific staff ID.
     *
     * @param id The staff ID.
     * @return List of shifts.
     */
    @GetMapping("/{id}/shifts")
    public List<ShiftDTO> getShiftsByStaff(@PathVariable Long id) {
        log.info("Fetching shifts for staff ID: {}", id);
        return staffService.getShiftsByStaff(id);
    }

    /**
     * Retrieves shifts for a specific date.
     *
     * @param date The date to search for.
     * @return List of shifts for that date.
     */
    @GetMapping("/shifts")
    public List<ShiftDTO> getShiftsByDate(@RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        log.info("Fetching shifts for date: {}", date);
        return staffService.getShiftsByDate(date);
    }
}
