package com.nsbm.group35.healthcare.notification.controller;

import com.nsbm.group35.healthcare.notification.model.NotificationDTO;
import com.nsbm.group35.healthcare.notification.service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // Create a new notification
    @PostMapping
    public ResponseEntity<NotificationDTO> createNotification(@RequestBody NotificationDTO notificationDTO) {
        NotificationDTO created = notificationService.createNotification(notificationDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Get all notifications
    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getAllNotifications() {
        List<NotificationDTO> notifications = notificationService.getAllNotifications();
        return ResponseEntity.ok(notifications);
    }

    // Get notification by ID
    @GetMapping("/{notificationId}")
    public ResponseEntity<NotificationDTO> getNotificationById(@PathVariable String notificationId) {
        return notificationService.getNotificationById(notificationId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get notifications by recipient ID
    @GetMapping("/recipient/{recipientId}")
    public ResponseEntity<List<NotificationDTO>> getNotificationsByRecipientId(@PathVariable String recipientId) {
        List<NotificationDTO> notifications = notificationService.getNotificationsByRecipientId(recipientId);
        return ResponseEntity.ok(notifications);
    }

    // Get notifications by recipient ID and status
    @GetMapping("/recipient/{recipientId}/status/{status}")
    public ResponseEntity<List<NotificationDTO>> getNotificationsByRecipientIdAndStatus(
            @PathVariable String recipientId, @PathVariable String status) {
        List<NotificationDTO> notifications = notificationService.getNotificationsByRecipientIdAndStatus(recipientId,
                status);
        return ResponseEntity.ok(notifications);
    }

    // Get notifications by type
    @GetMapping("/type/{type}")
    public ResponseEntity<List<NotificationDTO>> getNotificationsByType(@PathVariable String type) {
        List<NotificationDTO> notifications = notificationService.getNotificationsByType(type);
        return ResponseEntity.ok(notifications);
    }

    // Get notifications by recipient type
    @GetMapping("/recipient-type/{recipientType}")
    public ResponseEntity<List<NotificationDTO>> getNotificationsByRecipientType(@PathVariable String recipientType) {
        List<NotificationDTO> notifications = notificationService.getNotificationsByRecipientType(recipientType);
        return ResponseEntity.ok(notifications);
    }

    // Get unread notifications for a recipient
    @GetMapping("/recipient/{recipientId}/unread")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications(@PathVariable String recipientId) {
        List<NotificationDTO> notifications = notificationService.getUnreadNotifications(recipientId);
        return ResponseEntity.ok(notifications);
    }

    // Get unread notification count for a recipient
    @GetMapping("/recipient/{recipientId}/unread/count")
    public ResponseEntity<Long> getUnreadCount(@PathVariable String recipientId) {
        long count = notificationService.getUnreadCount(recipientId);
        return ResponseEntity.ok(count);
    }

    // Mark notification as read
    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<NotificationDTO> markAsRead(@PathVariable String notificationId) {
        try {
            NotificationDTO updated = notificationService.markAsRead(notificationId);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Update a notification
    @PutMapping("/{notificationId}")
    public ResponseEntity<NotificationDTO> updateNotification(
            @PathVariable String notificationId, @RequestBody NotificationDTO notificationDTO) {
        try {
            NotificationDTO updated = notificationService.updateNotification(notificationId, notificationDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a notification
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(@PathVariable String notificationId) {
        try {
            notificationService.deleteNotification(notificationId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}