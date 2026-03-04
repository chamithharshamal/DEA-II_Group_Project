package com.nsbm.group35.healthcare.notification.service;

import com.nsbm.group35.healthcare.notification.entity.Notification;
import com.nsbm.group35.healthcare.notification.model.NotificationDTO;
import com.nsbm.group35.healthcare.notification.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    // DTO -> Entity
    private Notification toEntity(NotificationDTO dto) {
        Notification notification = new Notification();
        notification.setNotificationId(dto.getNotificationId());
        notification.setRecipientId(dto.getRecipientId());
        notification.setRecipientType(dto.getRecipientType());
        notification.setType(dto.getType());
        notification.setTitle(dto.getTitle());
        notification.setMessage(dto.getMessage());
        notification.setStatus(dto.getStatus());
        notification.setCreatedAt(dto.getCreatedAt());
        notification.setReadAt(dto.getReadAt());
        return notification;
    }

    // Entity -> DTO
    private NotificationDTO toDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setNotificationId(notification.getNotificationId());
        dto.setRecipientId(notification.getRecipientId());
        dto.setRecipientType(notification.getRecipientType());
        dto.setType(notification.getType());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setStatus(notification.getStatus());
        dto.setCreatedAt(notification.getCreatedAt());
        dto.setReadAt(notification.getReadAt());
        return dto;
    }

    public NotificationDTO createNotification(NotificationDTO notificationDTO) {
        Notification notification = toEntity(notificationDTO);
        notification.setNotificationId(UUID.randomUUID().toString());
        notification.setStatus("UNREAD");
        notification.setCreatedAt(LocalDateTime.now().toString());
        return toDTO(notificationRepository.save(notification));
    }

    public List<NotificationDTO> getAllNotifications() {
        return notificationRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public Optional<NotificationDTO> getNotificationById(String notificationId) {
        return notificationRepository.findById(notificationId).map(this::toDTO);
    }

    public List<NotificationDTO> getNotificationsByRecipientId(String recipientId) {
        return notificationRepository.findByRecipientId(recipientId).stream().map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<NotificationDTO> getNotificationsByRecipientIdAndStatus(String recipientId, String status) {
        return notificationRepository.findByRecipientIdAndStatus(recipientId, status).stream().map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<NotificationDTO> getNotificationsByType(String type) {
        return notificationRepository.findByType(type).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<NotificationDTO> getNotificationsByRecipientType(String recipientType) {
        return notificationRepository.findByRecipientType(recipientType).stream().map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<NotificationDTO> getUnreadNotifications(String recipientId) {
        return notificationRepository.findByRecipientIdAndReadAtIsNull(recipientId).stream().map(this::toDTO)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(String recipientId) {
        return notificationRepository.countByRecipientIdAndStatus(recipientId, "UNREAD");
    }

    public NotificationDTO markAsRead(String notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found: " + notificationId));
        notification.setStatus("READ");
        notification.setReadAt(LocalDateTime.now().toString());
        return toDTO(notificationRepository.save(notification));
    }

    public NotificationDTO updateNotification(String notificationId, NotificationDTO updatedNotificationDTO) {
        Notification existing = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found: " + notificationId));
        existing.setRecipientId(updatedNotificationDTO.getRecipientId());
        existing.setRecipientType(updatedNotificationDTO.getRecipientType());
        existing.setType(updatedNotificationDTO.getType());
        existing.setTitle(updatedNotificationDTO.getTitle());
        existing.setMessage(updatedNotificationDTO.getMessage());
        existing.setStatus(updatedNotificationDTO.getStatus());
        return toDTO(notificationRepository.save(existing));
    }

    public void deleteNotification(String notificationId) {
        if (!notificationRepository.existsById(notificationId)) {
            throw new RuntimeException("Notification not found: " + notificationId);
        }
        notificationRepository.deleteById(notificationId);
    }
}