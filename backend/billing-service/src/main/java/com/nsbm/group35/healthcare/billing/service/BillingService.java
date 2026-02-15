package com.nsbm.group35.healthcare.billing.service;

import com.nsbm.group35.healthcare.billing.model.Billing;
import com.nsbm.group35.healthcare.billing.repository.BillingRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BillingService {

    private final BillingRepository billingRepository;

    public BillingService(BillingRepository billingRepository) {
        this.billingRepository = billingRepository;
    }

    public List<Billing> getAllBillings() {
        return billingRepository.findAll();
    }

    public Optional<Billing> getBillingById(String billingId) {
        return billingRepository.findById(billingId);
    }

    public Billing createBilling(Billing billing) {
        return billingRepository.save(billing);
    }

    public Billing updateBilling(String billingId, Billing billing) {
        billing.setBillingId(billingId);
        return billingRepository.save(billing);
    }

    public void deleteBilling(String billingId) {
        billingRepository.deleteById(billingId);
    }

    public List<Billing> getBillingsByPatientId(String patientId) {
        return billingRepository.findByPatientId(patientId);
    }

    public List<Billing> getBillingsByDoctorId(String doctorId) {
        return billingRepository.findByDoctorId(doctorId);
    }

    public List<Billing> getBillingsByAppointmentId(String appointmentId) {
        return billingRepository.findByAppointmentId(appointmentId);
    }

    public List<Billing> getBillingsByPaymentStatus(String paymentStatus) {
        return billingRepository.findByPaymentStatus(paymentStatus);
    }

    public Billing updatePaymentStatus(String billingId, String paymentStatus) {
        Optional<Billing> billing = billingRepository.findById(billingId);
        if (billing.isPresent()) {
            Billing b = billing.get();
            b.setPaymentStatus(paymentStatus);
            return billingRepository.save(b);
        }
        return null;
    }

    public double calculateTotalAmount(double consultationFee, double labTestFee, 
                                       double medicationFee, double otherFee) {
        return consultationFee + labTestFee + medicationFee + otherFee;
    }
}
