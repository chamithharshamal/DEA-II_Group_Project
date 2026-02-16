package com.nsbm.group35.healthcare.staff.service;

import com.nsbm.group35.healthcare.staff.model.Shift;
import com.nsbm.group35.healthcare.staff.model.Staff;
import com.nsbm.group35.healthcare.staff.repository.ShiftRepository;
import com.nsbm.group35.healthcare.staff.repository.StaffRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class StaffService {

    private final StaffRepository staffRepository;
    private final ShiftRepository shiftRepository;

    public StaffService(StaffRepository staffRepository, ShiftRepository shiftRepository) {
        this.staffRepository = staffRepository;
        this.shiftRepository = shiftRepository;
    }

    // --- Staff Methods ---

    public Staff addStaff(Staff staff) {
        return staffRepository.save(staff);
    }

    public Optional<Staff> getStaffById(Long id) {
        return staffRepository.findById(id);
    }

    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    public Staff updateStaff(Long id, Staff staffDetails) {
        return staffRepository.findById(id).map(staff -> {
            staff.setFirstName(staffDetails.getFirstName());
            staff.setLastName(staffDetails.getLastName());
            staff.setEmail(staffDetails.getEmail());
            staff.setRole(staffDetails.getRole());
            staff.setDepartment(staffDetails.getDepartment());
            return staffRepository.save(staff);
        }).orElse(null);
    }

    // --- Shift Methods ---

    public Shift assignShift(Shift shift) {
        if (shift.getStaff() != null && shift.getStaff().getStaffId() != null) {
            Staff staff = staffRepository.findById(shift.getStaff().getStaffId())
                    .orElseThrow(() -> new RuntimeException("Staff not found"));
            shift.setStaff(staff);
            return shiftRepository.save(shift);
        }
        throw new RuntimeException("Staff ID is required");
    }

    public List<Shift> getShiftsByStaff(Long staffId) {
        return shiftRepository.findByStaff_StaffId(staffId);
    }

    public List<Shift> getShiftsByDate(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();
        return shiftRepository.findShiftsByDate(startOfDay, endOfDay);
    }
}