package com.nsbm.group35.healthcare.staff.model;

import java.time.LocalDateTime;

public class ShiftDTO {

    private Long shiftId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long staffId;

    public ShiftDTO() {}

    public ShiftDTO(Long shiftId, LocalDateTime startTime, LocalDateTime endTime, Long staffId) {
        this.shiftId = shiftId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.staffId = staffId;
    }

    // Getters and Setters
    public Long getShiftId() { return shiftId; }
    public void setShiftId(Long shiftId) { this.shiftId = shiftId; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public Long getStaffId() { return staffId; }
    public void setStaffId(Long staffId) { this.staffId = staffId; }
}
