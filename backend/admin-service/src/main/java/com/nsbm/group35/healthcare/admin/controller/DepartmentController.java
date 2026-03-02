package com.nsbm.group35.healthcare.admin.controller;

import com.nsbm.group35.healthcare.admin.model.DepartmentDTO;
import com.nsbm.group35.healthcare.admin.service.DepartmentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for managing Department operations.
 * Handles CRUD operations for hospital departments.
 */
@Slf4j
@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    /**
     * Retrieves all departments.
     *
     * @return List of DepartmentDTO objects.
     */
    @GetMapping
    public List<DepartmentDTO> getAllDepartments() {
        log.info("Fetching all departments");
        return departmentService.getAllDepartments();
    }

    /**
     * Retrieves a specific department by its ID.
     *
     * @param id The ID of the department.
     * @return The DepartmentDTO if found.
     */
    @GetMapping("/{id}")
    public ResponseEntity<DepartmentDTO> getDepartmentById(@PathVariable String id) {
        log.info("Fetching department with ID: {}", id);
        return departmentService.getDepartmentById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    log.warn("Department with ID: {} not found", id);
                    return ResponseEntity.notFound().build();
                });
    }

    /**
     * Creates a new department.
     *
     * @param departmentDTO DTO containing details of the new department.
     * @return The created DepartmentDTO.
     */
    @PostMapping
    public DepartmentDTO createDepartment(@RequestBody DepartmentDTO departmentDTO) {
        log.info("Creating new department: {}", departmentDTO.getDepartmentName());
        return departmentService.createDepartment(departmentDTO);
    }

    /**
     * Updates an existing department.
     *
     * @param id            The ID of the department to update.
     * @param departmentDTO DTO containing updated department details.
     * @return The updated DepartmentDTO.
     */
    @PutMapping("/{id}")
    public DepartmentDTO updateDepartment(@PathVariable String id, @RequestBody DepartmentDTO departmentDTO) {
        log.info("Updating department with ID: {}", id);
        return departmentService.updateDepartment(id, departmentDTO);
    }

    /**
     * Deletes a department by ID.
     *
     * @param id The ID of the department to delete.
     * @return No content.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable String id) {
        log.info("Deleting department with ID: {}", id);
        departmentService.deleteDepartment(id);
        return ResponseEntity.noContent().build();
    }
}
