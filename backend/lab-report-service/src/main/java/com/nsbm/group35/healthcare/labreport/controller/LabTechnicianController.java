package com.nsbm.group35.healthcare.labreport.controller;

import com.nsbm.group35.healthcare.labreport.config.JwtUtil;
import com.nsbm.group35.healthcare.labreport.model.AuthResponseDTO;
import com.nsbm.group35.healthcare.labreport.entity.LabTechnician;
import com.nsbm.group35.healthcare.labreport.model.LabTechnicianDTO;
import com.nsbm.group35.healthcare.labreport.model.LoginRequestDTO;
import com.nsbm.group35.healthcare.labreport.service.LabTechnicianService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lab-reports")
public class LabTechnicianController {

    @Autowired
    private LabTechnicianService labTechnicianService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        LabTechnicianDTO authenticatedUser = labTechnicianService.authenticate(
                loginRequest.getUsername(), loginRequest.getPassword());

        if (authenticatedUser != null) {
            String token = jwtUtil.generateToken(authenticatedUser.getTechnicianId(), authenticatedUser.getRole());
            return ResponseEntity.ok(new AuthResponseDTO(token, authenticatedUser.getRole(), authenticatedUser));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }

    // Optional utility endpoint to register a new technician for testing purposes
    @PostMapping("/register")
    public ResponseEntity<?> registerTechnician(@RequestBody LabTechnician technician) {
        try {
            if (technician.getRole() == null || technician.getRole().isEmpty()) {
                technician.setRole("TECHNICIAN");
            }
            LabTechnician created = labTechnicianService.registerTechnician(technician);
            return ResponseEntity.status(HttpStatus.CREATED).body(labTechnicianService.convertToDTO(created));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to register technician");
        }
    }
}
