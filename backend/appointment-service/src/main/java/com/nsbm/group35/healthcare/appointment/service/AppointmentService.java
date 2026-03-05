package com.nsbm.group35.healthcare.appointment.service;

import com.nsbm.group35.healthcare.appointment.client.DoctorClient;
import com.nsbm.group35.healthcare.appointment.client.PatientClient;
import com.nsbm.group35.healthcare.appointment.entity.Appointment;
import com.nsbm.group35.healthcare.appointment.model.AppointmentDTO;
import com.nsbm.group35.healthcare.appointment.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientClient patientClient;
    private final DoctorClient doctorClient;

    public AppointmentService(AppointmentRepository appointmentRepository,
            PatientClient patientClient,
            DoctorClient doctorClient) {
        this.appointmentRepository = appointmentRepository;
        this.patientClient = patientClient;
        this.doctorClient = doctorClient;
    }

    public AppointmentDTO bookAppointment(AppointmentDTO appointmentDTO) {
        // Verify patient exists
        try {
            Map<String, Object> patient = patientClient.getPatientById(appointmentDTO.getPatientId());
            if (patient == null) {
                throw new RuntimeException("Patient not found with ID: " + appointmentDTO.getPatientId());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error verifying patient: " + e.getMessage());
        }

        // Verify doctor exists
        try {
            Map<String, Object> doctor = doctorClient.getDoctorById(appointmentDTO.getDoctorId());
            if (doctor == null) {
                throw new RuntimeException("Doctor not found with ID: " + appointmentDTO.getDoctorId());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error verifying doctor: " + e.getMessage());
        }

        Appointment appointment = toEntity(appointmentDTO);
        appointment.setStatus("PLANNED");

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return toDTO(savedAppointment);
    }

    public AppointmentDTO getAppointmentById(String id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + id));
        return toDTO(appointment);
    }

    public List<AppointmentDTO> getByPatient(String patientId) {
        return appointmentRepository.findByPatientId(patientId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<AppointmentDTO> getByDoctor(String doctorId) {
        return appointmentRepository.findByDoctorId(doctorId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public AppointmentDTO cancelAppointment(String id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + id));
        appointment.setStatus("CANCELLED");
        return toDTO(appointmentRepository.save(appointment));
    }

    public AppointmentDTO completeAppointment(String id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + id));
        appointment.setStatus("COMPLETED");
        return toDTO(appointmentRepository.save(appointment));
    }

    public List<AppointmentDTO> getTodaysAppointments(String doctorId) {
        // Implement logic for today's appointments if needed, currently using custom
        // finder
        return appointmentRepository.findByDoctorIdAndStatus(doctorId, "PLANNED").stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private Appointment toEntity(AppointmentDTO dto) {
        return Appointment.builder()
                .id(dto.getId())
                .patientId(dto.getPatientId())
                .doctorId(dto.getDoctorId())
                .appointmentTime(dto.getAppointmentTime())
                .status(dto.getStatus())
                .reason(dto.getReason())
                .build();
    }

    private AppointmentDTO toDTO(Appointment entity) {
        return AppointmentDTO.builder()
                .id(entity.getId())
                .patientId(entity.getPatientId())
                .doctorId(entity.getDoctorId())
                .appointmentTime(entity.getAppointmentTime())
                .status(entity.getStatus())
                .reason(entity.getReason())
                .build();
    }
}