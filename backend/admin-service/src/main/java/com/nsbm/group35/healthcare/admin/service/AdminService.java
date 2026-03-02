package com.nsbm.group35.healthcare.admin.service;

import com.nsbm.group35.healthcare.admin.config.JwtUtil;
import com.nsbm.group35.healthcare.admin.entity.Admin;
import com.nsbm.group35.healthcare.admin.model.AdminDTO;
import com.nsbm.group35.healthcare.admin.repository.AdminRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AdminService(AdminRepository adminRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    // DTO -> Entity
    private Admin toEntity(AdminDTO dto) {
        Admin admin = new Admin();
        admin.setAdminId(dto.getAdminId());
        admin.setName(dto.getName());
        admin.setEmail(dto.getEmail());
        admin.setPassword(dto.getPassword());
        admin.setRole(dto.getRole());
        return admin;
    }

    // Entity -> DTO
    private AdminDTO toDTO(Admin admin) {
        AdminDTO dto = new AdminDTO();
        dto.setAdminId(admin.getAdminId());
        dto.setName(admin.getName());
        dto.setEmail(admin.getEmail());
        dto.setPassword(admin.getPassword());
        dto.setRole(admin.getRole());
        return dto;
    }

    // Login — returns JWT token if credentials are valid
    public String login(String email, String password) {
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found with email: " + email));

        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return jwtUtil.generateToken(admin.getEmail());
    }

    public List<AdminDTO> getAllAdmins() {
        return adminRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<AdminDTO> getAdminById(String adminId) {
        return adminRepository.findById(adminId).map(this::toDTO);
    }

    // Hash password before saving
    public AdminDTO createAdmin(AdminDTO adminDTO) {
        Admin admin = toEntity(adminDTO);
        admin.setPassword(passwordEncoder.encode(adminDTO.getPassword()));
        return toDTO(adminRepository.save(admin));
    }

    public AdminDTO updateAdmin(String adminId, AdminDTO adminDTO) {
        Admin admin = toEntity(adminDTO);
        admin.setAdminId(adminId);
        if (adminDTO.getPassword() != null && !adminDTO.getPassword().isEmpty()) {
            admin.setPassword(passwordEncoder.encode(adminDTO.getPassword()));
        }
        return toDTO(adminRepository.save(admin));
    }

    public void deleteAdmin(String adminId) {
        adminRepository.deleteById(adminId);
    }
}
