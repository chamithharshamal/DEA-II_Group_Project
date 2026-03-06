package com.nsbm.group35.healthcare.staff.config;

import com.nsbm.group35.healthcare.staff.entity.Staff;
import com.nsbm.group35.healthcare.staff.repository.StaffRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedDatabase(StaffRepository staffRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (staffRepository.count() == 0) {
                Staff s1 = new Staff(null, "Admin", "User", "admin@hospital.com", passwordEncoder.encode("admin123"),
                        "ADMIN", "Management");
                Staff s2 = new Staff(null, "Nimali", "Perera", "nimali@hospital.com",
                        passwordEncoder.encode("nurse123"), "NURSE", "ICU");
                Staff s3 = new Staff(null, "Kamal", "Silva", "kamal@hospital.com", passwordEncoder.encode("staff123"),
                        "RECEPTIONIST", "Front Desk");
                Staff s4 = new Staff(null, "Sunil", "Fernando", "sunil@hospital.com", passwordEncoder.encode("lab123"),
                        "LAB_TECHNICIAN", "Laboratory");

                staffRepository.saveAll(List.of(s1, s2, s3, s4));
                System.out.println("Successfully seeded staff database.");
            }
        };
    }
}
