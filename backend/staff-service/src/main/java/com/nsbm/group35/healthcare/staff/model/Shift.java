package com.nsbm.group35.healthcare.staff.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "shifts")
public class Shift {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "staff_id", nullable = false)
    private Staff staff;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDate date;

    // No-Args Constructor
    public Shift() {
    }

    // All-Args Constructor
    public Shift(Long id, Staff staff, LocalDateTime startTime, LocalDateTime endTime, LocalDate date) {
        this.id = id;
        this.staff = staff;
        this.startTime = startTime;
        this.endTime = endTime;
        this.date = date;
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Staff getStaff() { return staff; }
    public void setStaff(Staff staff) { this.staff = staff; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    @Override
    public String toString() {
        return "Shift{" +
                "id=" + id +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", date=" + date +
                '}';
    }
}