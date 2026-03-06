package com.nsbm.group35.healthcare.patient.config;

import com.nsbm.group35.healthcare.patient.entity.Patient;
import com.nsbm.group35.healthcare.patient.repository.PatientRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedDatabase(PatientRepository patientRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (patientRepository.count() == 0) {
                Patient p1 = new Patient("P001", "Amal", "Perera", "amal@example.com",
                        passwordEncoder.encode("password"), "0771234567", "Colombo", "1990-01-01", "Male", "O+");
                Patient p2 = new Patient("P002", "Kamani", "Silva", "kamani@example.com",
                        passwordEncoder.encode("password"), "0712345678", "Kandy", "1985-05-15", "Female", "A+");
                Patient p3 = new Patient("P003", "Nuwan", "Fernando", "nuwan@example.com",
                        passwordEncoder.encode("password"), "0783456789", "Galle", "1995-08-20", "Male", "B-");

                patientRepository.saveAll(List.of(p1, p2, p3));
                System.out.println("Successfully seeded patient database.");
            }
        };
    }
}
