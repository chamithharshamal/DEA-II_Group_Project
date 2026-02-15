package com.nsbm.group35.healthcare.billing.controller;

import com.nsbm.group35.healthcare.billing.model.Billing;
import com.nsbm.group35.healthcare.billing.service.BillingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/billings")
public class BillingController {

    @Autowired
    private BillingService billingService;

    @GetMapping
    public ResponseEntity<List<Billing>> getAllBillings() {
        List<Billing> billings = billingService.getAllBillings();
        return ResponseEntity.ok(billings);
    }

    @GetMapping("/{billingId}")
    public ResponseEntity<Billing> getBillingById(@PathVariable String billingId) {
        Optional<Billing> billing = billingService.getBillingById(billingId);
        return billing.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Billing> createBilling(@RequestBody Billing billing) {
        Billing createdBilling = billingService.createBilling(billing);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBilling);
    }

    @PutMapping("/{billingId}")
    public ResponseEntity<Billing> updateBilling(@PathVariable String billingId, @RequestBody Billing billing) {
        Billing updatedBilling = billingService.updateBilling(billingId, billing);
        return ResponseEntity.ok(updatedBilling);
    }

    @DeleteMapping("/{billingId}")
    public ResponseEntity<Void> deleteBilling(@PathVariable String billingId) {
        billingService.deleteBilling(billingId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Billing>> getBillingsByPatientId(@PathVariable String patientId) {
        List<Billing> billings = billingService.getBillingsByPatientId(patientId);
        return ResponseEntity.ok(billings);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Billing>> getBillingsByDoctorId(@PathVariable String doctorId) {
        List<Billing> billings = billingService.getBillingsByDoctorId(doctorId);
        return ResponseEntity.ok(billings);
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<List<Billing>> getBillingsByAppointmentId(@PathVariable String appointmentId) {
        List<Billing> billings = billingService.getBillingsByAppointmentId(appointmentId);
        return ResponseEntity.ok(billings);
    }

    @GetMapping("/status/{paymentStatus}")
    public ResponseEntity<List<Billing>> getBillingsByPaymentStatus(@PathVariable String paymentStatus) {
        List<Billing> billings = billingService.getBillingsByPaymentStatus(paymentStatus);
        return ResponseEntity.ok(billings);
    }

    @PatchMapping("/{billingId}/status")
    public ResponseEntity<Billing> updatePaymentStatus(@PathVariable String billingId, 
                                                       @RequestParam String paymentStatus) {
        Billing billing = billingService.updatePaymentStatus(billingId, paymentStatus);
        if (billing != null) {
            return ResponseEntity.ok(billing);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/calculate")
    public ResponseEntity<Double> calculateTotalAmount(@RequestParam double consultationFee,
                                                       @RequestParam double labTestFee,
                                                       @RequestParam double medicationFee,
                                                       @RequestParam double otherFee) {
        double totalAmount = billingService.calculateTotalAmount(consultationFee, labTestFee, medicationFee, otherFee);
        return ResponseEntity.ok(totalAmount);
    }
}
