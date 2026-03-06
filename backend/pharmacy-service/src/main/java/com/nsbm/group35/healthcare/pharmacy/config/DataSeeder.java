package com.nsbm.group35.healthcare.pharmacy.config;

import com.nsbm.group35.healthcare.pharmacy.entity.Medication;
import com.nsbm.group35.healthcare.pharmacy.repository.MedicationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedDatabase(MedicationRepository medicationRepository) {
        return args -> {
            if (medicationRepository.count() == 0) {
                List<Medication> meds = List.of(
                        new Medication(null, "Panadol 500mg", "Paracetamol for pain and fever", 500, 5.0, 0),
                        new Medication(null, "Amoxicillin 250mg", "Antibiotic for bacterial infections", 200, 15.0, 0),
                        new Medication(null, "Piriton 4mg", "Chlorphenamine for allergies", 300, 10.0, 0),
                        new Medication(null, "Metformin 500mg", "Diabetes management", 400, 8.0, 0),
                        new Medication(null, "Losartan 50mg", "Blood pressure medication", 250, 12.0, 0),
                        new Medication(null, "Atorvastatin 20mg", "Cholesterol lowering medication", 200, 20.0, 0),
                        new Medication(null, "Omeprazole 20mg", "Gastritis and acid reflux", 350, 15.5, 0),
                        new Medication(null, "Vitamin C 500mg", "Immunity booster supplement", 1000, 5.0, 0),
                        new Medication(null, "Ibuprofen 400mg", "NSAID for pain and inflammation", 450, 10.0, 0),
                        new Medication(null, "Salbutamol Inhaler", "Asthma relief inhaler", 100, 450.0, 0));
                medicationRepository.saveAll(meds);
                System.out.println("Successfully seeded pharmacy database.");
            }
        };
    }
}
