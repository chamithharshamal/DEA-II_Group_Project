package com.nsbm.group35.healthcare.notification.controller;

import com.nsbm.group35.healthcare.notification.model.Notification;
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
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
        Notification created = notificationService.createNotification(notification);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Get all notifications
    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications() {
        List<Notification> notifications = notificationService.getAllNotifications();
        return ResponseEntity.ok(notifications);
    }

    // Get notification by ID
    @GetMapping("/{notificationId}")
    public ResponseEntity<Notification> getNotificationById(@PathVariable String notificationId) {
        return notificationService.getNotificationById(notificationId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get notifications by recipient ID
    @GetMapping("/recipient/{recipientId}")
    public ResponseEntity<List<Notification>> getNotificationsByRecipientId(@PathVariable String recipientId) {
        List<Notification> notifications = notificationService.getNotificationsByRecipientId(recipientId);
        return ResponseEntity.ok(notifications);
    }

    // Get notifications by recipient ID and status
    @GetMapping("/recipient/{recipientId}/status/{status}")
    public ResponseEntity<List<Notification>> getNotificationsByRecipientIdAndStatus(
            @PathVariable String recipientId, @PathVariable String status) {
        List<Notification> notifications = notificationService.getNotificationsByRecipientIdAndStatus(recipientId, status);
        return ResponseEntity.ok(notifications);
    }

    // Get notifications by type
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Notification>> getNotificationsByType(@PathVariable String type) {
        List<Notification> notifications = notificationService.getNotificationsByType(type);
        return ResponseEntity.ok(notifications);
    }

    // Get notifications by recipient type
    @GetMapping("/recipient-type/{recipientType}")
    public ResponseEntity<List<Notification>> getNotificationsByRecipientType(@PathVariable String recipientType) {
        List<Notification> notifications = notificationService.getNotificationsByRecipientType(recipientType);
        return ResponseEntity.ok(notifications);
    }

    // Get unread notifications for a recipient
    @GetMapping("/recipient/{recipientId}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(@PathVariable String recipientId) {
        List<Notification> notifications = notificationService.getUnreadNotifications(recipientId);
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
    public ResponseEntity<Notification> markAsRead(@PathVariable String notificationId) {
        try {
            Notification updated = notificationService.markAsRead(notificationId);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Update a notification
    @PutMapping("/{notificationId}")
    public ResponseEntity<Notification> updateNotification(
            @PathVariable String notificationId, @RequestBody Notification notification) {
        try {
            Notification updated = notificationService.updateNotification(notificationId, notification);
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