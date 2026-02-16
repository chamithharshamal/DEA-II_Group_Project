package com.nsbm.group35.healthcare.pharmacy.service;

import com.nsbm.group35.healthcare.pharmacy.model.Medication;
import com.nsbm.group35.healthcare.pharmacy.model.Prescription;
import com.nsbm.group35.healthcare.pharmacy.repository.MedicationRepository;
import com.nsbm.group35.healthcare.pharmacy.repository.PrescriptionRepository;
import com.nsbm.group35.healthcare.pharmacy.exception.MedicationNotFoundException;
import com.nsbm.group35.healthcare.pharmacy.exception.PrescriptionNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PharmacyService {

    private final MedicationRepository medicationRepository;
    private final PrescriptionRepository prescriptionRepository;

    public PharmacyService(MedicationRepository medicationRepository,
                           PrescriptionRepository prescriptionRepository) {
        this.medicationRepository = medicationRepository;
        this.prescriptionRepository = prescriptionRepository;
    }

    // ===================== Medications =====================

    /** Add a new medication */
    public Medication addMedication(Medication medication) {
        return medicationRepository.save(medication);
    }

    /** Get all medications */
    public List<Medication> getAllMedications() {
        return medicationRepository.findAll();
    }

    /** Update stock of a medication */
    @Transactional
    public Medication updateStock(Long medicationId, int quantity) {
        Medication medication = medicationRepository.findById(medicationId)
                .orElseThrow(() -> new MedicationNotFoundException(medicationId));

        medication.setStock(medication.getStock() + quantity);
        return medicationRepository.save(medication);
    }

    /** Get medications with low stock */
    public List<Medication> getLowStock(int threshold) {
        return medicationRepository.findByStockLessThan(threshold);
    }

    // ===================== Prescriptions =====================

    /** Create a new prescription */
    public Prescription createPrescription(Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }

    /** Dispense a prescription and deduct medication stock */
    @Transactional
    public Prescription dispensePrescription(Long prescriptionId) {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new PrescriptionNotFoundException(prescriptionId));

        // Deduct stock for each medication in prescription
        prescription.getMedications().forEach(med -> {
            Medication medication = medicationRepository.findById(med.getId())
                    .orElseThrow(() -> new MedicationNotFoundException(med.getId()));

            int remainingStock = medication.getStock() - med.getQuantity();
            if (remainingStock < 0) {
                throw new RuntimeException("Not enough stock for medication: " + medication.getName());
            }
            medication.setStock(remainingStock);
            medicationRepository.save(medication);
        });

        prescription.setDispensed(true);
        return prescriptionRepository.save(prescription);
    }

    /** Get all prescriptions for a patient */
    public List<Prescription> getPrescriptionsByPatient(String patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }
}
