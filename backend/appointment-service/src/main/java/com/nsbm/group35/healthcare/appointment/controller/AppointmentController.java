package com.nsbm.group35.healthcare.appointment.controller;

import com.nsbm.group35.healthcare.appointment.model.Appointment;
import com.nsbm.group35.healthcare.appointment.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService service;

    @PostMapping
    public ResponseEntity<Appointment> book(@RequestBody Appointment appointment) {
        return ResponseEntity.ok(service.bookAppointment(appointment));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getById(@PathVariable Long id) {
        return service.getAppointmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public List<Appointment> getByPatient(@PathVariable Long patientId) {
        return service.getByPatient(patientId);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<Appointment> getByDoctor(@PathVariable Long doctorId) {
        return service.getByDoctor(doctorId);
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Appointment> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(service.cancelAppointment(id));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<Appointment> complete(@PathVariable Long id) {
        return ResponseEntity.ok(service.completeAppointment(id));
    }

    @GetMapping("/doctor/{doctorId}/today")
    public List<Appointment> getToday(@PathVariable Long doctorId) {
        return service.getTodayAppointments(doctorId);
    }
}