package com.nsbm.group35.healthcare.doctor.service;

import com.nsbm.group35.healthcare.doctor.model.Doctor;
import com.nsbm.group35.healthcare.doctor.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Optional<Doctor> getDoctorById(String doctorId) {
        return doctorRepository.findById(doctorId);
    }

    public List<Doctor> getDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecialization(specialization);
    }

    public Optional<Doctor> getDoctorByEmail(String email) {
        return doctorRepository.findByEmail(email);
    }

    public Doctor createDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public Doctor updateDoctor(String doctorId, Doctor doctor) {
        doctor.setDoctorId(doctorId);
        return doctorRepository.save(doctor);
    }

    public void deleteDoctor(String doctorId) {
        doctorRepository.deleteById(doctorId);
    }
}
