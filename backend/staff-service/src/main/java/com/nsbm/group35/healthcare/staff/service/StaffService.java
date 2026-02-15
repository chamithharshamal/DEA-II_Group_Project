package com.nsbm.group35.healthcare.staff.service;

// 👇 THESE IMPORTS WERE MISSING! 👇
import com.nsbm.group35.healthcare.staff.dto.ShiftDTO;
import com.nsbm.group35.healthcare.staff.dto.StaffDTO;
import com.nsbm.group35.healthcare.staff.model.Shift;
import com.nsbm.group35.healthcare.staff.model.Staff;
import com.nsbm.group35.healthcare.staff.repository.ShiftRepository;
import com.nsbm.group35.healthcare.staff.repository.StaffRepository;
// 👆 ---------------------------- 👆

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class StaffService {

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private ShiftRepository shiftRepository;



    public Staff addStaff(StaffDTO dto) {
        Staff staff = new Staff();
        staff.setFirstName(dto.getFirstName());
        staff.setLastName(dto.getLastName());
        staff.setEmail(dto.getEmail());
        staff.setRole(dto.getRole());
        staff.setDepartment(dto.getDepartment());
        staff.setPhoneNumber(dto.getPhoneNumber());
        staff.setActive(true);
        return staffRepository.save(staff);
    }

    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    public Optional<Staff> getStaffById(Long id) {
        return staffRepository.findById(id);
    }

    public Staff updateStaff(Long id, StaffDTO dto) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found with ID: " + id));

        staff.setFirstName(dto.getFirstName());
        staff.setLastName(dto.getLastName());
        staff.setEmail(dto.getEmail());
        staff.setRole(dto.getRole());
        staff.setDepartment(dto.getDepartment());
        staff.setPhoneNumber(dto.getPhoneNumber());

        return staffRepository.save(staff);
    }

    // --- SHIFT METHODS ---

    public Shift assignShift(ShiftDTO dto) {
        Staff staff = staffRepository.findById(dto.getStaffId())
                .orElseThrow(() -> new RuntimeException("Staff not found with ID: " + dto.getStaffId()));

        Shift shift = new Shift();
        shift.setStaff(staff);
        shift.setStartTime(dto.getStartTime());
        shift.setEndTime(dto.getEndTime());

        if (dto.getStartTime() != null) {
            shift.setDate(dto.getStartTime().toLocalDate());
        }

        return shiftRepository.save(shift);
    }

    public List<Shift> getShiftsByStaff(Long staffId) {
        return shiftRepository.findByStaffId(staffId);
    }

    public List<Shift> getShiftsByDate(LocalDate date) {
        return shiftRepository.findByDate(date);
    }
}