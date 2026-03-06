package com.nsbm.group35.healthcare.staff.service;

import com.nsbm.group35.healthcare.staff.config.JwtUtil;
import com.nsbm.group35.healthcare.staff.entity.Shift;
import com.nsbm.group35.healthcare.staff.entity.Staff;
import com.nsbm.group35.healthcare.staff.model.ShiftDTO;
import com.nsbm.group35.healthcare.staff.model.StaffDTO;
import com.nsbm.group35.healthcare.staff.repository.ShiftRepository;
import com.nsbm.group35.healthcare.staff.repository.StaffRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class StaffService {

    private final StaffRepository staffRepository;
    private final ShiftRepository shiftRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public StaffService(StaffRepository staffRepository, ShiftRepository shiftRepository, JwtUtil jwtUtil,
            PasswordEncoder passwordEncoder) {
        this.staffRepository = staffRepository;
        this.shiftRepository = shiftRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    // --- Mapper Methods ---

    private Staff toEntity(StaffDTO dto) {
        Staff staff = new Staff();
        staff.setStaffId(dto.getStaffId());
        staff.setFirstName(dto.getFirstName());
        staff.setLastName(dto.getLastName());
        staff.setEmail(dto.getEmail());
        staff.setPassword(dto.getPassword());
        staff.setRole(dto.getRole());
        staff.setDepartment(dto.getDepartment());
        return staff;
    }

    private StaffDTO toDTO(Staff staff) {
        StaffDTO dto = new StaffDTO();
        dto.setStaffId(staff.getStaffId());
        dto.setFirstName(staff.getFirstName());
        dto.setLastName(staff.getLastName());
        dto.setEmail(staff.getEmail());
        // Do not return password in DTO generally, but keeping for parity with admin if
        // needed
        dto.setPassword(staff.getPassword());
        dto.setRole(staff.getRole());
        dto.setDepartment(staff.getDepartment());
        return dto;
    }

    private ShiftDTO toShiftDTO(Shift shift) {
        ShiftDTO dto = new ShiftDTO();
        dto.setShiftId(shift.getShiftId());
        dto.setStartTime(shift.getStartTime());
        dto.setEndTime(shift.getEndTime());
        if (shift.getStaff() != null) {
            dto.setStaffId(shift.getStaff().getStaffId());
        }
        return dto;
    }

    // --- Authentication ---

    public String login(String email, String password) {
        Staff staff = staffRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Staff not found with email: " + email));

        if (!passwordEncoder.matches(password, staff.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return jwtUtil.generateToken(staff.getEmail(), "STAFF");
    }

    // --- Staff Methods ---

    public StaffDTO addStaff(StaffDTO staffDTO) {
        log.info("Adding new staff: {}", staffDTO.getEmail());
        Staff staff = toEntity(staffDTO);
        staff.setPassword(passwordEncoder.encode(staffDTO.getPassword()));
        return toDTO(staffRepository.save(staff));
    }

    public Optional<StaffDTO> getStaffById(Long id) {
        return staffRepository.findById(id).map(this::toDTO);
    }

    public List<StaffDTO> getAllStaff() {
        return staffRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public StaffDTO updateStaff(Long id, StaffDTO staffDetails) {
        log.info("Updating staff ID: {}", id);
        return staffRepository.findById(id).map(staff -> {
            staff.setFirstName(staffDetails.getFirstName());
            staff.setLastName(staffDetails.getLastName());
            staff.setEmail(staffDetails.getEmail());
            staff.setRole(staffDetails.getRole());
            staff.setDepartment(staffDetails.getDepartment());
            if (staffDetails.getPassword() != null && !staffDetails.getPassword().isEmpty()) {
                staff.setPassword(passwordEncoder.encode(staffDetails.getPassword()));
            }
            return toDTO(staffRepository.save(staff));
        }).orElseThrow(() -> new RuntimeException("Staff not found"));
    }

    public void deleteStaff(Long id) {
        log.info("Deleting staff ID: {}", id);
        staffRepository.deleteById(id);
    }

    // --- Shift Methods ---

    public ShiftDTO assignShift(ShiftDTO shiftDTO) {
        log.info("Assigning shift to staff ID: {}", shiftDTO.getStaffId());
        Staff staff = staffRepository.findById(shiftDTO.getStaffId())
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        Shift shift = new Shift();
        shift.setStartTime(shiftDTO.getStartTime());
        shift.setEndTime(shiftDTO.getEndTime());
        shift.setStaff(staff);

        return toShiftDTO(shiftRepository.save(shift));
    }

    public List<ShiftDTO> getShiftsByStaff(Long staffId) {
        return shiftRepository.findByStaff_StaffId(staffId).stream()
                .map(this::toShiftDTO)
                .collect(Collectors.toList());
    }

    public List<ShiftDTO> getShiftsByDate(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();
        return shiftRepository.findShiftsByDate(startOfDay, endOfDay).stream()
                .map(this::toShiftDTO)
                .collect(Collectors.toList());
    }
}