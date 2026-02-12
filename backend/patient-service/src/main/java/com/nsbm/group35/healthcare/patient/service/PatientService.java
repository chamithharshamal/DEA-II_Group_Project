package com.nsbm.group35.healthcare.patient.service;

import com.nsbm.group35.healthcare.patient.model.Patient;
import com.nsbm.group35.healthcare.patient.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Optional<Patient> getPatientById(String patientId) {
        return patientRepository.findById(patientId);
    }

    public Patient createPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public Patient updatePatient(String patientId, Patient patient) {
        patient.setPatientId(patientId);
        return patientRepository.save(patient);
    }

    public void deletePatient(String patientId) {
        patientRepository.deleteById(patientId);
    }
}
