package com.nsbm.group35.healthcare.patient.service;

import com.nsbm.group35.healthcare.patient.config.JwtUtil;
import com.nsbm.group35.healthcare.patient.entity.Patient;
import com.nsbm.group35.healthcare.patient.model.PatientDTO;
import com.nsbm.group35.healthcare.patient.repository.PatientRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public PatientService(PatientRepository patientRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.patientRepository = patientRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    // DTO -> Entity
    private Patient toEntity(PatientDTO dto) {
        Patient patient = new Patient();
        patient.setPatientId(dto.getPatientId());
        patient.setFirstName(dto.getFirstName());
        patient.setLastName(dto.getLastName());
        patient.setEmail(dto.getEmail());
        patient.setPassword(dto.getPassword());
        patient.setPhone(dto.getPhone());
        patient.setAddress(dto.getAddress());
        patient.setDateOfBirth(dto.getDateOfBirth());
        patient.setGender(dto.getGender());
        patient.setBloodGroup(dto.getBloodGroup());
        return patient;
    }

    // Entity -> DTO
    private PatientDTO toDTO(Patient patient) {
        PatientDTO dto = new PatientDTO();
        dto.setPatientId(patient.getPatientId());
        dto.setFirstName(patient.getFirstName());
        dto.setLastName(patient.getLastName());
        dto.setEmail(patient.getEmail());
        dto.setPassword(patient.getPassword());
        dto.setPhone(patient.getPhone());
        dto.setAddress(patient.getAddress());
        dto.setDateOfBirth(patient.getDateOfBirth());
        dto.setGender(patient.getGender());
        dto.setBloodGroup(patient.getBloodGroup());
        return dto;
    }

    // Login — returns JWT token if credentials are valid
    public String login(String email, String password) {
        Patient patient = patientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient not found with email: " + email));

        if (!passwordEncoder.matches(password, patient.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return jwtUtil.generateToken(patient.getEmail());
    }

    public List<PatientDTO> getAllPatients() {
        return patientRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<PatientDTO> getPatientById(String patientId) {
        return patientRepository.findById(patientId).map(this::toDTO);
    }

    // Hash password before saving
    public PatientDTO createPatient(PatientDTO patientDTO) {
        Patient patient = toEntity(patientDTO);
        patient.setPassword(passwordEncoder.encode(patientDTO.getPassword()));
        return toDTO(patientRepository.save(patient));
    }

    public PatientDTO updatePatient(String patientId, PatientDTO patientDTO) {
        Patient patient = toEntity(patientDTO);
        patient.setPatientId(patientId);
        if (patientDTO.getPassword() != null && !patientDTO.getPassword().isEmpty()) {
            patient.setPassword(passwordEncoder.encode(patientDTO.getPassword()));
        }
        return toDTO(patientRepository.save(patient));
    }

    public void deletePatient(String patientId) {
        patientRepository.deleteById(patientId);
    }
}
