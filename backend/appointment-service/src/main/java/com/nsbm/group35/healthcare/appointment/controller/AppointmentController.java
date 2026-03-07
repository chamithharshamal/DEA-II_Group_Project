package com.nsbm.group35.healthcare.appointment.controller;

import com.nsbm.group35.healthcare.appointment.model.AppointmentDTO;
import com.nsbm.group35.healthcare.appointment.service.AppointmentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@Slf4j
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<AppointmentDTO> bookAppointment(@RequestBody AppointmentDTO appointmentDTO) {
        log.info("Booking new appointment for patient ID: {}", appointmentDTO.getPatientId());
        AppointmentDTO savedAppointment = appointmentService.bookAppointment(appointmentDTO);
        return new ResponseEntity<>(savedAppointment, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentDTO> getAppointment(@PathVariable String id) {
        log.info("Fetching appointment with ID: {}", id);
        return ResponseEntity.ok(appointmentService.getAppointmentById(id));
    }

    @GetMapping
    public ResponseEntity<List<AppointmentDTO>> getAllAppointments() {
        log.info("Fetching all appointments");
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<AppointmentDTO>> getByPatient(@PathVariable String patientId) {
        log.info("Fetching appointments for patient ID: {}", patientId);
        return ResponseEntity.ok(appointmentService.getByPatient(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<AppointmentDTO>> getByDoctor(@PathVariable String doctorId) {
        log.info("Fetching appointments for doctor ID: {}", doctorId);
        return ResponseEntity.ok(appointmentService.getByDoctor(doctorId));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<AppointmentDTO> cancelAppointment(@PathVariable String id) {
        log.info("Cancelling appointment with ID: {}", id);
        return ResponseEntity.ok(appointmentService.cancelAppointment(id));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<AppointmentDTO> completeAppointment(@PathVariable String id) {
        log.info("Marking appointment with ID: {} as completed", id);
        return ResponseEntity.ok(appointmentService.completeAppointment(id));
    }

    @GetMapping("/doctor/{doctorId}/today")
    public ResponseEntity<List<AppointmentDTO>> getTodaysAppointments(@PathVariable String doctorId) {
        log.info("Fetching today's appointments for doctor ID: {}", doctorId);
        return ResponseEntity.ok(appointmentService.getTodaysAppointments(doctorId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<AppointmentDTO>> searchAppointments(@RequestParam(required = false) String doctorId,
            @RequestParam(required = false) String patientId) {
        log.info("Searching appointments with doctorId: {} and patientId: {}", doctorId, patientId);
        return ResponseEntity.ok(appointmentService.searchAppointments(doctorId, patientId));
    }
}