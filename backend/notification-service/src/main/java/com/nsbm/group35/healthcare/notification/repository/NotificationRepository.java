package com.nsbm.group35.healthcare.notification.repository;

import com.nsbm.group35.healthcare.notification.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {

    // Find all notifications for a specific recipient
    List<Notification> findByRecipientId(String recipientId);

    // Find notifications by recipient and status
    List<Notification> findByRecipientIdAndStatus(String recipientId, String status);

    // Find notifications by type
    List<Notification> findByType(String type);

    // Find notifications by recipient type (e.g., "DOCTOR", "PATIENT")
    List<Notification> findByRecipientType(String recipientType);

    // Find unread notifications for a recipient
    List<Notification> findByRecipientIdAndReadAtIsNull(String recipientId);

    // Count unread notifications for a recipient
    long countByRecipientIdAndStatus(String recipientId, String status);
}