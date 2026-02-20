package com.nsbm.group35.healthcare.pharmacy.controller;

import com.nsbm.group35.healthcare.pharmacy.model.Medication;
import com.nsbm.group35.healthcare.pharmacy.model.Prescription;
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

    // ===================== Medications =====================

    /** GET /api/medications - List all medications */
    @GetMapping("/medications")
    public List<Medication> getAllMedications() {
        return pharmacyService.getAllMedications();
    }

    /** GET /api/medications/{id} - Get a medication by ID */
    @GetMapping("/medications/{id}")
    public ResponseEntity<Medication> getMedicationById(@PathVariable Long id) {
        return pharmacyService.getMedicationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** GET /api/medications/search?name=... - Search medications by name */
    @GetMapping("/medications/search")
    public List<Medication> searchMedications(@RequestParam String name) {
        return pharmacyService.searchMedications(name);
    }

    /** POST /api/medications - Add a new medication */
    @PostMapping("/medications")
    public ResponseEntity<Medication> addMedication(@RequestBody Medication medication) {
        return ResponseEntity.ok(pharmacyService.addMedication(medication));
    }

    /** PUT /api/medications/{id} - Update medication details */
    @PutMapping("/medications/{id}")
    public ResponseEntity<Medication> updateMedication(@PathVariable Long id,
                                                        @RequestBody Medication medication) {
        return ResponseEntity.ok(pharmacyService.updateMedication(id, medication));
    }

    /** PUT /api/medications/{id}/stock?quantity=N - Adjust stock (positive = add, negative = deduct) */
    @PutMapping("/medications/{id}/stock")
    public ResponseEntity<Medication> updateStock(@PathVariable Long id,
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
    public List<Medication> getLowStock(@RequestParam(defaultValue = "10") int threshold) {
        return pharmacyService.getLowStock(threshold);
    }

    // ===================== Prescriptions =====================

    /** GET /api/prescriptions - List all prescriptions */
    @GetMapping("/prescriptions")
    public List<Prescription> getAllPrescriptions() {
        return pharmacyService.getAllPrescriptions();
    }

    /** GET /api/prescriptions/{id} - Get a prescription by ID */
    @GetMapping("/prescriptions/{id}")
    public ResponseEntity<Prescription> getPrescriptionById(@PathVariable Long id) {
        return pharmacyService.getPrescriptionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** GET /api/prescriptions/patient/{patientId} - Get prescriptions for a patient */
    @GetMapping("/prescriptions/patient/{patientId}")
    public List<Prescription> getPrescriptionsByPatient(@PathVariable String patientId) {
        return pharmacyService.getPrescriptionsByPatient(patientId);
    }

    /** GET /api/prescriptions/patient/{patientId}/pending - Get undispensed prescriptions */
    @GetMapping("/prescriptions/patient/{patientId}/pending")
    public List<Prescription> getPendingPrescriptions(@PathVariable String patientId) {
        return pharmacyService.getPendingPrescriptionsByPatient(patientId);
    }

    /** POST /api/prescriptions - Create a new prescription */
    @PostMapping("/prescriptions")
    public ResponseEntity<Prescription> createPrescription(@RequestBody Prescription prescription) {
        return ResponseEntity.ok(pharmacyService.createPrescription(prescription));
    }

    /** POST /api/prescriptions/{id}/dispense - Dispense a prescription */
    @PostMapping("/prescriptions/{id}/dispense")
    public ResponseEntity<Prescription> dispensePrescription(@PathVariable Long id) {
        return ResponseEntity.ok(pharmacyService.dispensePrescription(id));
    }
}
