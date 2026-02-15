package com.nsbm.group35.healthcare.staff.dto;

import java.time.LocalDateTime;

public class ShiftDTO {

    private Long staffId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

   
    public ShiftDTO() {
    }

    // All-Args Constructor
    public ShiftDTO(Long staffId, LocalDateTime startTime, LocalDateTime endTime) {
        this.staffId = staffId;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    // Getters and Setters
    public Long getStaffId() { return staffId; }
    public void setStaffId(Long staffId) { this.staffId = staffId; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    @Override
    public String toString() {
        return "ShiftDTO{" +
                "staffId=" + staffId +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                '}';
    }
}