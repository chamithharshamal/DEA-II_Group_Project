package com.nsbm.group35.healthcare.billing.repository;

import com.nsbm.group35.healthcare.billing.model.Billing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BillingRepository extends JpaRepository<Billing, String> {
    List<Billing> findByPatientId(String patientId);
    List<Billing> findByDoctorId(String doctorId);
    List<Billing> findByAppointmentId(String appointmentId);
    List<Billing> findByPaymentStatus(String paymentStatus);
}
