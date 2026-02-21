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
import java.util.Optional;

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

    public Medication addMedication(Medication medication) {
        return medicationRepository.save(medication);
    }

    public List<Medication> getAllMedications() {
        return medicationRepository.findAll();
    }

    public Optional<Medication> getMedicationById(Long id) {
        return medicationRepository.findById(id);
    }

    public List<Medication> searchMedications(String name) {
        return medicationRepository.findByNameContainingIgnoreCase(name);
    }

    @Transactional
    public Medication updateStock(Long medicationId, int quantity) {
        Medication medication = medicationRepository.findById(medicationId)
                .orElseThrow(() -> new MedicationNotFoundException(medicationId));
        medication.setStock(medication.getStock() + quantity);
        return medicationRepository.save(medication);
    }

    @Transactional
    public Medication updateMedication(Long medicationId, Medication updated) {
        Medication medication = medicationRepository.findById(medicationId)
                .orElseThrow(() -> new MedicationNotFoundException(medicationId));
        medication.setName(updated.getName());
        medication.setDescription(updated.getDescription());
        medication.setStock(updated.getStock());
        medication.setPrice(updated.getPrice());
        return medicationRepository.save(medication);
    }

    public void deleteMedication(Long medicationId) {
        if (!medicationRepository.existsById(medicationId)) {
            throw new MedicationNotFoundException(medicationId);
        }
        medicationRepository.deleteById(medicationId);
    }

    public List<Medication> getLowStock(int threshold) {
        return medicationRepository.findByStockLessThan(threshold);
    }

    // ===================== Prescriptions =====================

    public Prescription createPrescription(Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }

    public Optional<Prescription> getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id);
    }

    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    @Transactional
    public Prescription dispensePrescription(Long prescriptionId) {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new PrescriptionNotFoundException(prescriptionId));

        if (prescription.isDispensed()) {
            throw new RuntimeException("Prescription " + prescriptionId + " has already been dispensed.");
        }

        prescription.getMedications().forEach(med -> {
            Medication medication = medicationRepository.findById(med.getId())
                    .orElseThrow(() -> new MedicationNotFoundException(med.getId()));

            int remainingStock = medication.getStock() - med.getQuantity();
            if (remainingStock < 0) {
                throw new RuntimeException("Not enough stock for: " + medication.getName()
                        + ". Available: " + medication.getStock() + ", Requested: " + med.getQuantity());
            }
            medication.setStock(remainingStock);
            medicationRepository.save(medication);
        });

        prescription.setDispensed(true);
        return prescriptionRepository.save(prescription);
    }

    public List<Prescription> getPrescriptionsByPatient(String patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }

    public List<Prescription> getPendingPrescriptionsByPatient(String patientId) {
        return prescriptionRepository.findByPatientIdAndDispensed(patientId, false);
    }
}
