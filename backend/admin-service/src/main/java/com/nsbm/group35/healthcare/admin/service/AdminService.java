package com.nsbm.group35.healthcare.admin.service;

import com.nsbm.group35.healthcare.admin.model.Admin;
import com.nsbm.group35.healthcare.admin.repository.AdminRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    private final AdminRepository adminRepository;

    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Optional<Admin> getAdminById(String adminId) {
        return adminRepository.findById(adminId);
    }

    public Admin createAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    public Admin updateAdmin(String adminId, Admin admin) {
        admin.setAdminId(adminId);
        return adminRepository.save(admin);
    }

    public void deleteAdmin(String adminId) {
        adminRepository.deleteById(adminId);
    }
}
