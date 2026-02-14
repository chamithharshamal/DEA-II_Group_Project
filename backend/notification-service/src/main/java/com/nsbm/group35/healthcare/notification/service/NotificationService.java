package com.nsbm.group35.healthcare.notification.service;

import com.nsbm.group35.healthcare.notification.model.Notification;

import java.util.List;
import java.util.Optional;

public interface NotificationService {

    Notification createNotification(Notification notification);

    List<Notification> getAllNotifications();

    Optional<Notification> getNotificationById(String notificationId);

    List<Notification> getNotificationsByRecipientId(String recipientId);

    List<Notification> getNotificationsByRecipientIdAndStatus(String recipientId, String status);

    List<Notification> getNotificationsByType(String type);

    List<Notification> getNotificationsByRecipientType(String recipientType);

    List<Notification> getUnreadNotifications(String recipientId);

    long getUnreadCount(String recipientId);

    Notification markAsRead(String notificationId);

    Notification updateNotification(String notificationId, Notification notification);

    void deleteNotification(String notificationId);
}