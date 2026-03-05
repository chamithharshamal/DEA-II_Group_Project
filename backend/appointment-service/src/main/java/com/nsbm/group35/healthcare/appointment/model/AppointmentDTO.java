package com.nsbm.group35.healthcare.appointment.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentDTO {

    private String id;
    private String patientId;
    private String doctorId;
    private LocalDateTime appointmentTime;
    private String status;
    private String reason;
}