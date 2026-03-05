package com.nsbm.group35.healthcare.labreport.service;

import com.nsbm.group35.healthcare.labreport.entity.LabTechnician;
import com.nsbm.group35.healthcare.labreport.model.LabTechnicianDTO;
import com.nsbm.group35.healthcare.labreport.repository.LabTechnicianRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LabTechnicianService {

    @Autowired
    private LabTechnicianRepository labTechnicianRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public LabTechnician registerTechnician(LabTechnician technician) {
        technician.setPassword(passwordEncoder.encode(technician.getPassword()));
        return labTechnicianRepository.save(technician);
    }

    public LabTechnicianDTO authenticate(String username, String password) {
        Optional<LabTechnician> technicianOpt = labTechnicianRepository.findByTechnicianIdOrEmail(username, username);

        if (technicianOpt.isPresent()) {
            LabTechnician technician = technicianOpt.get();
            if (passwordEncoder.matches(password, technician.getPassword())) {
                return convertToDTO(technician);
            }
        }
        return null; // Authentication failed
    }

    public LabTechnicianDTO convertToDTO(LabTechnician technician) {
        return new LabTechnicianDTO(
                technician.getTechnicianId(),
                technician.getName(),
                technician.getEmail(),
                technician.getPhone(),
                technician.getDepartment(),
                technician.getRole());
    }
}
