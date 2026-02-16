package com.nsbm.group35.healthcare.staff.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "shifts")
public class Shift {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long shiftId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private Staff staff;

    public Shift() {
    }

    public Shift(Long shiftId, LocalDateTime startTime, LocalDateTime endTime, Staff staff) {
        this.shiftId = shiftId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.staff = staff;
    }

    public Long getShiftId() {
        return shiftId;
    }

    public void setShiftId(Long shiftId) {
        this.shiftId = shiftId;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public Staff getStaff() {
        return staff;
    }

    public void setStaff(Staff staff) {
        this.staff = staff;
    }
}