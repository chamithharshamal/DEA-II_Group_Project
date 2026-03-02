package com.nsbm.group35.healthcare.admin.controller;

import com.nsbm.group35.healthcare.admin.model.AdminDTO;
import com.nsbm.group35.healthcare.admin.model.LoginRequest;
import com.nsbm.group35.healthcare.admin.service.AdminService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller for managing Admin operations.
 * Handles authentication and basic CRUD operations.
 */
@Slf4j
@RestController
@RequestMapping("/api/admins")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    /**
     * Authenticates an admin using email and password.
     *
     * @param loginRequest DTO containing email and password.
     * @return A map containing the JWT token if successful, or error details.
     */
    // Public endpoint — no token needed
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        log.info("Attempting login for admin email: {}", loginRequest.getEmail());
        try {
            String token = adminService.login(loginRequest.getEmail(), loginRequest.getPassword());
            log.info("Login successful for admin email: {}", loginRequest.getEmail());
            return ResponseEntity.ok(Map.of("token", token));
        } catch (RuntimeException e) {
            log.error("Login failed for admin email: {}. Reason: {}", loginRequest.getEmail(), e.getMessage());
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Retrieves all registered admins.
     *
     * @return List of AdminDTO objects.
     */
    @GetMapping
    public List<AdminDTO> getAllAdmins() {
        log.info("Fetching all admins");
        return adminService.getAllAdmins();
    }

    /**
     * Retrieves a specific admin by their ID.
     *
     * @param id The ID of the admin.
     * @return The AdminDTO if found.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AdminDTO> getAdminById(@PathVariable String id) {
        log.info("Fetching admin with ID: {}", id);
        return adminService.getAdminById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    log.warn("Admin with ID: {} not found", id);
                    return ResponseEntity.notFound().build();
                });
    }

    /**
     * Creates a new admin.
     *
     * @param adminDTO DTO containing the details of the new admin.
     * @return The created AdminDTO.
     */
    @PostMapping
    public AdminDTO createAdmin(@RequestBody AdminDTO adminDTO) {
        log.info("Creating new admin with email: {}", adminDTO.getEmail());
        return adminService.createAdmin(adminDTO);
    }

    /**
     * Updates an existing admin.
     *
     * @param id       The ID of the admin to update.
     * @param adminDTO DTO containing updated admin details.
     * @return The updated AdminDTO.
     */
    @PutMapping("/{id}")
    public AdminDTO updateAdmin(@PathVariable String id, @RequestBody AdminDTO adminDTO) {
        log.info("Updating admin with ID: {}", id);
        return adminService.updateAdmin(id, adminDTO);
    }

    /**
     * Deletes an admin by ID.
     *
     * @param id The ID of the admin to delete.
     * @return No content.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable String id) {
        log.info("Deleting admin with ID: {}", id);
        adminService.deleteAdmin(id);
        return ResponseEntity.noContent().build();
    }
}
