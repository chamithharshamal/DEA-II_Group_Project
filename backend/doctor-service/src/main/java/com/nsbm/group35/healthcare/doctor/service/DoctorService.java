package com.nsbm.group35.healthcare.doctor.service;

import com.nsbm.group35.healthcare.doctor.config.JwtUtil;
import com.nsbm.group35.healthcare.doctor.entity.Doctor;
import com.nsbm.group35.healthcare.doctor.model.DoctorDTO;
import com.nsbm.group35.healthcare.doctor.repository.DoctorRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public DoctorService(DoctorRepository doctorRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.doctorRepository = doctorRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    // DTO -> Entity
    private Doctor toEntity(DoctorDTO dto) {
        Doctor doctor = new Doctor();
        doctor.setDoctorId(dto.getDoctorId());
        doctor.setFirstName(dto.getFirstName());
        doctor.setLastName(dto.getLastName());
        doctor.setEmail(dto.getEmail());
        doctor.setPassword(dto.getPassword());
        doctor.setPhone(dto.getPhone());
        doctor.setAddress(dto.getAddress());
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setQualifications(dto.getQualifications());
        doctor.setExperienceYears(dto.getExperienceYears());
        return doctor;
    }

    // Entity -> DTO
    private DoctorDTO toDTO(Doctor doctor) {
        DoctorDTO dto = new DoctorDTO();
        dto.setDoctorId(doctor.getDoctorId());
        dto.setFirstName(doctor.getFirstName());
        dto.setLastName(doctor.getLastName());
        dto.setEmail(doctor.getEmail());
        dto.setPassword(doctor.getPassword());
        dto.setPhone(doctor.getPhone());
        dto.setAddress(doctor.getAddress());
        dto.setSpecialization(doctor.getSpecialization());
        dto.setQualifications(doctor.getQualifications());
        dto.setExperienceYears(doctor.getExperienceYears());
        return dto;
    }

    // Login — returns JWT token if credentials are valid
    public String login(String email, String password) {
        Doctor doctor = doctorRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Doctor not found with email: " + email));

        if (!passwordEncoder.matches(password, doctor.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return jwtUtil.generateToken(doctor.getEmail(), "DOCTOR");
    }

    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<DoctorDTO> getDoctorById(String doctorId) {
        return doctorRepository.findById(doctorId).map(this::toDTO);
    }

    public List<DoctorDTO> getDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecialization(specialization)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<DoctorDTO> getDoctorByEmail(String email) {
        return doctorRepository.findByEmail(email).map(this::toDTO);
    }

    public DoctorDTO createDoctor(DoctorDTO doctorDTO) {
        Doctor doctor = toEntity(doctorDTO);
        doctor.setPassword(passwordEncoder.encode(doctorDTO.getPassword()));
        return toDTO(doctorRepository.save(doctor));
    }

    public DoctorDTO updateDoctor(String doctorId, DoctorDTO doctorDTO) {
        Doctor doctor = toEntity(doctorDTO);
        doctor.setDoctorId(doctorId);
        if (doctorDTO.getPassword() != null && !doctorDTO.getPassword().isEmpty()) {
            doctor.setPassword(passwordEncoder.encode(doctorDTO.getPassword()));
        }
        return toDTO(doctorRepository.save(doctor));
    }

    public void deleteDoctor(String doctorId) {
        doctorRepository.deleteById(doctorId);
    }
}
