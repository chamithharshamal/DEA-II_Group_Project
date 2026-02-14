package com.nsbm.group35.healthcare.notification.service;

import com.nsbm.group35.healthcare.notification.model.Notification;
import com.nsbm.group35.healthcare.notification.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public Notification createNotification(Notification notification) {
        notification.setNotificationId(UUID.randomUUID().toString());
        notification.setStatus("UNREAD");
        notification.setCreatedAt(LocalDateTime.now().toString());
        return notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    @Override
    public Optional<Notification> getNotificationById(String notificationId) {
        return notificationRepository.findById(notificationId);
    }

    @Override
    public List<Notification> getNotificationsByRecipientId(String recipientId) {
        return notificationRepository.findByRecipientId(recipientId);
    }

    @Override
    public List<Notification> getNotificationsByRecipientIdAndStatus(String recipientId, String status) {
        return notificationRepository.findByRecipientIdAndStatus(recipientId, status);
    }

    @Override
    public List<Notification> getNotificationsByType(String type) {
        return notificationRepository.findByType(type);
    }

    @Override
    public List<Notification> getNotificationsByRecipientType(String recipientType) {
        return notificationRepository.findByRecipientType(recipientType);
    }

    @Override
    public List<Notification> getUnreadNotifications(String recipientId) {
        return notificationRepository.findByRecipientIdAndReadAtIsNull(recipientId);
    }

    @Override
    public long getUnreadCount(String recipientId) {
        return notificationRepository.countByRecipientIdAndStatus(recipientId, "UNREAD");
    }

    @Override
    public Notification markAsRead(String notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found: " + notificationId));
        notification.setStatus("READ");
        notification.setReadAt(LocalDateTime.now().toString());
        return notificationRepository.save(notification);
    }

    @Override
    public Notification updateNotification(String notificationId, Notification updatedNotification) {
        Notification existing = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found: " + notificationId));
        existing.setRecipientId(updatedNotification.getRecipientId());
        existing.setRecipientType(updatedNotification.getRecipientType());
        existing.setType(updatedNotification.getType());
        existing.setTitle(updatedNotification.getTitle());
        existing.setMessage(updatedNotification.getMessage());
        existing.setStatus(updatedNotification.getStatus());
        return notificationRepository.save(existing);
    }

    @Override
    public void deleteNotification(String notificationId) {
        if (!notificationRepository.existsById(notificationId)) {
            throw new RuntimeException("Notification not found: " + notificationId);
        }
        notificationRepository.deleteById(notificationId);
    }
}