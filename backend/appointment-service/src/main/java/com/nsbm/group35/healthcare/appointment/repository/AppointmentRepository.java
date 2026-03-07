package com.nsbm.group35.healthcare.appointment.repository;

import com.nsbm.group35.healthcare.appointment.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, String> {

    List<Appointment> findByPatientId(String patientId);

    List<Appointment> findByDoctorId(String doctorId);

    List<Appointment> findByDoctorIdAndStatus(String doctorId, String status);

    @org.springframework.data.jpa.repository.Query("SELECT a FROM Appointment a WHERE " +
            "(:doctorId IS NULL OR a.doctorId = :doctorId) AND " +
            "(:patientId IS NULL OR a.patientId = :patientId)")
    List<Appointment> searchAppointments(@org.springframework.data.repository.query.Param("doctorId") String doctorId,
            @org.springframework.data.repository.query.Param("patientId") String patientId);
}