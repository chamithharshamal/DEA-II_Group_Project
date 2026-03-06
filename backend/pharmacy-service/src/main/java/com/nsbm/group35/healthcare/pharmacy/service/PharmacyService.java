package com.nsbm.group35.healthcare.pharmacy.service;

import com.nsbm.group35.healthcare.pharmacy.entity.Medication;
import com.nsbm.group35.healthcare.pharmacy.entity.Prescription;
import com.nsbm.group35.healthcare.pharmacy.entity.Pharmacist;
import com.nsbm.group35.healthcare.pharmacy.model.MedicationDTO;
import com.nsbm.group35.healthcare.pharmacy.model.PrescriptionDTO;
import com.nsbm.group35.healthcare.pharmacy.model.PharmacistDTO;
import com.nsbm.group35.healthcare.pharmacy.model.LoginRequest;
import com.nsbm.group35.healthcare.pharmacy.repository.MedicationRepository;
import com.nsbm.group35.healthcare.pharmacy.repository.PrescriptionRepository;
import com.nsbm.group35.healthcare.pharmacy.repository.PharmacistRepository;
import com.nsbm.group35.healthcare.pharmacy.exception.MedicationNotFoundException;
import com.nsbm.group35.healthcare.pharmacy.exception.PrescriptionNotFoundException;
import com.nsbm.group35.healthcare.pharmacy.config.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PharmacyService {

    private final MedicationRepository medicationRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PharmacistRepository pharmacistRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public PharmacyService(MedicationRepository medicationRepository,
            PrescriptionRepository prescriptionRepository,
            PharmacistRepository pharmacistRepository,
            JwtUtil jwtUtil,
            PasswordEncoder passwordEncoder) {
        this.medicationRepository = medicationRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.pharmacistRepository = pharmacistRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    // ===================== Pharmacist / Auth =====================

    public PharmacistDTO login(LoginRequest request) {
        Pharmacist pharmacist = pharmacistRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), pharmacist.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(pharmacist.getEmail(), "PHARMACIST");
        PharmacistDTO response = new PharmacistDTO(pharmacist);
        response.setToken(token);
        return response;
    }

    // ===================== Medications =====================

    public MedicationDTO addMedication(MedicationDTO medicationDTO) {
        Medication medication = new Medication();
        medication.setName(medicationDTO.getName());
        medication.setDescription(medicationDTO.getDescription());
        medication.setStock(medicationDTO.getStock());
        medication.setPrice(medicationDTO.getPrice());
        Medication saved = medicationRepository.save(medication);
        return new MedicationDTO(saved);
    }

    public List<MedicationDTO> getAllMedications() {
        return medicationRepository.findAll().stream()
                .map(MedicationDTO::new)
                .collect(Collectors.toList());
    }

    public Optional<MedicationDTO> getMedicationById(Long id) {
        return medicationRepository.findById(id).map(MedicationDTO::new);
    }

    public List<MedicationDTO> searchMedications(String name) {
        return medicationRepository.findByNameContainingIgnoreCase(name).stream()
                .map(MedicationDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public MedicationDTO updateStock(Long medicationId, int quantity) {
        Medication medication = medicationRepository.findById(medicationId)
                .orElseThrow(() -> new MedicationNotFoundException(medicationId));
        medication.setStock(medication.getStock() + quantity);
        return new MedicationDTO(medicationRepository.save(medication));
    }

    @Transactional
    public MedicationDTO updateMedication(Long medicationId, MedicationDTO updated) {
        Medication medication = medicationRepository.findById(medicationId)
                .orElseThrow(() -> new MedicationNotFoundException(medicationId));
        medication.setName(updated.getName());
        medication.setDescription(updated.getDescription());
        medication.setStock(updated.getStock());
        medication.setPrice(updated.getPrice());
        return new MedicationDTO(medicationRepository.save(medication));
    }

    public void deleteMedication(Long medicationId) {
        if (!medicationRepository.existsById(medicationId)) {
            throw new MedicationNotFoundException(medicationId);
        }
        medicationRepository.deleteById(medicationId);
    }

    public List<MedicationDTO> getLowStock(int threshold) {
        return medicationRepository.findByStockLessThan(threshold).stream()
                .map(MedicationDTO::new)
                .collect(Collectors.toList());
    }

    // ===================== Prescriptions =====================

    public PrescriptionDTO createPrescription(PrescriptionDTO prescriptionDTO) {
        Prescription prescription = new Prescription();
        prescription.setPatientId(prescriptionDTO.getPatientId());
        prescription.setDoctorId(prescriptionDTO.getDoctorId());
        prescription.setPrescribedDate(prescriptionDTO.getPrescribedDate());
        prescription.setDispensed(prescriptionDTO.isDispensed());
        prescription.setMedications(prescriptionDTO.getMedications());
        Prescription saved = prescriptionRepository.save(prescription);
        return new PrescriptionDTO(saved);
    }

    public Optional<PrescriptionDTO> getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id).map(PrescriptionDTO::new);
    }

    public List<PrescriptionDTO> getAllPrescriptions() {
        return prescriptionRepository.findAll().stream()
                .map(PrescriptionDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public PrescriptionDTO dispensePrescription(Long prescriptionId) {
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
        return new PrescriptionDTO(prescriptionRepository.save(prescription));
    }

    public List<PrescriptionDTO> getPrescriptionsByPatient(String patientId) {
        return prescriptionRepository.findByPatientId(patientId).stream()
                .map(PrescriptionDTO::new)
                .collect(Collectors.toList());
    }

    public List<PrescriptionDTO> getPendingPrescriptionsByPatient(String patientId) {
        return prescriptionRepository.findByPatientIdAndDispensed(patientId, false).stream()
                .map(PrescriptionDTO::new)
                .collect(Collectors.toList());
    }
}
