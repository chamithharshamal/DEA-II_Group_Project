package com.nsbm.group35.healthcare.pharmacy.controller;

import com.nsbm.group35.healthcare.pharmacy.model.MedicationDTO;
import com.nsbm.group35.healthcare.pharmacy.model.PrescriptionDTO;
import com.nsbm.group35.healthcare.pharmacy.model.PharmacistDTO;
import com.nsbm.group35.healthcare.pharmacy.model.LoginRequest;
import com.nsbm.group35.healthcare.pharmacy.service.PharmacyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PharmacyController {

    private final PharmacyService pharmacyService;

    public PharmacyController(PharmacyService pharmacyService) {
        this.pharmacyService = pharmacyService;
    }

    // ===================== Pharmacist / Auth =====================

    @PostMapping("/pharmacists/login")
    public ResponseEntity<PharmacistDTO> login(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(pharmacyService.login(loginRequest));
    }

    // ===================== Medications =====================

    /** GET /api/medications - List all medications */
    @GetMapping("/medications")
    public List<MedicationDTO> getAllMedications() {
        return pharmacyService.getAllMedications();
    }

    /** GET /api/medications/{id} - Get a medication by ID */
    @GetMapping("/medications/{id}")
    public ResponseEntity<MedicationDTO> getMedicationById(@PathVariable Long id) {
        return pharmacyService.getMedicationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** GET /api/medications/search?name=... - Search medications by name */
    @GetMapping("/medications/search")
    public List<MedicationDTO> searchMedications(@RequestParam String name) {
        return pharmacyService.searchMedications(name);
    }

    /** POST /api/medications - Add a new medication */
    @PostMapping("/medications")
    public ResponseEntity<MedicationDTO> addMedication(@RequestBody MedicationDTO medicationDTO) {
        return ResponseEntity.ok(pharmacyService.addMedication(medicationDTO));
    }

    /** PUT /api/medications/{id} - Update medication details */
    @PutMapping("/medications/{id}")
    public ResponseEntity<MedicationDTO> updateMedication(@PathVariable Long id,
            @RequestBody MedicationDTO medicationDTO) {
        return ResponseEntity.ok(pharmacyService.updateMedication(id, medicationDTO));
    }

    /**
     * PUT /api/medications/{id}/stock?quantity=N - Adjust stock (positive = add,
     * negative = deduct)
     */
    @PutMapping("/medications/{id}/stock")
    public ResponseEntity<MedicationDTO> updateStock(@PathVariable Long id,
            @RequestParam int quantity) {
        return ResponseEntity.ok(pharmacyService.updateStock(id, quantity));
    }

    /** DELETE /api/medications/{id} - Delete a medication */
    @DeleteMapping("/medications/{id}")
    public ResponseEntity<Void> deleteMedication(@PathVariable Long id) {
        pharmacyService.deleteMedication(id);
        return ResponseEntity.noContent().build();
    }

    /** GET /api/medications/low-stock?threshold=N - Get low-stock alerts */
    @GetMapping("/medications/low-stock")
    public List<MedicationDTO> getLowStock(@RequestParam(defaultValue = "10") int threshold) {
        return pharmacyService.getLowStock(threshold);
    }

    // ===================== Prescriptions =====================

    /** GET /api/prescriptions - List all prescriptions */
    @GetMapping("/prescriptions")
    public List<PrescriptionDTO> getAllPrescriptions() {
        return pharmacyService.getAllPrescriptions();
    }

    /** GET /api/prescriptions/{id} - Get a prescription by ID */
    @GetMapping("/prescriptions/{id}")
    public ResponseEntity<PrescriptionDTO> getPrescriptionById(@PathVariable Long id) {
        return pharmacyService.getPrescriptionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/prescriptions/patient/{patientId} - Get prescriptions for a patient
     */
    @GetMapping("/prescriptions/patient/{patientId}")
    public List<PrescriptionDTO> getPrescriptionsByPatient(@PathVariable String patientId) {
        return pharmacyService.getPrescriptionsByPatient(patientId);
    }

    /**
     * GET /api/prescriptions/patient/{patientId}/pending - Get undispensed
     * prescriptions
     */
    @GetMapping("/prescriptions/patient/{patientId}/pending")
    public List<PrescriptionDTO> getPendingPrescriptions(@PathVariable String patientId) {
        return pharmacyService.getPendingPrescriptionsByPatient(patientId);
    }

    /** POST /api/prescriptions - Create a new prescription */
    @PostMapping("/prescriptions")
    public ResponseEntity<PrescriptionDTO> createPrescription(@RequestBody PrescriptionDTO prescriptionDTO) {
        return ResponseEntity.ok(pharmacyService.createPrescription(prescriptionDTO));
    }

    /** POST /api/prescriptions/{id}/dispense - Dispense a prescription */
    @PostMapping("/prescriptions/{id}/dispense")
    public ResponseEntity<PrescriptionDTO> dispensePrescription(@PathVariable Long id) {
        return ResponseEntity.ok(pharmacyService.dispensePrescription(id));
    }
}
