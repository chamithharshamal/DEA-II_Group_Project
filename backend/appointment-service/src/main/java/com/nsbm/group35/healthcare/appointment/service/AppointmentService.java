package com.nsbm.group35.healthcare.appointment.service;

import com.nsbm.group35.healthcare.appointment.model.Appointment;
import com.nsbm.group35.healthcare.appointment.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository repository;

    public Appointment bookAppointment(Appointment appointment) {
        appointment.setStatus("PLANNED"); // Required logic for booking
        return repository.save(appointment);
    }

    public Optional<Appointment> getAppointmentById(Long id) {
        return repository.findById(id);
    }

    public List<Appointment> getByPatient(Long patientId) {
        return repository.findByPatientId(patientId);
    }

    public List<Appointment> getByDoctor(Long doctorId) {
        return repository.findByDoctorId(doctorId);
    }

    public Appointment cancelAppointment(Long id) {
        Appointment appointment = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus("CANCELLED");
        return repository.save(appointment);
    }

    public Appointment completeAppointment(Long id) {
        Appointment appointment = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus("COMPLETED");
        return repository.save(appointment);
    }

    public List<Appointment> getTodayAppointments(Long doctorId) {
        return repository.findByDoctorIdAndStatus(doctorId, "PLANNED");
    }
}