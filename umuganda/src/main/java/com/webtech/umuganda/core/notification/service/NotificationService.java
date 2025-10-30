package com.webtech.umuganda.core.notification.service;

import com.webtech.umuganda.core.notification.dto.NotificationDto;

import java.util.List;
import java.util.UUID;

public interface NotificationService {

    NotificationDto createNotification(NotificationDto dto);

    NotificationDto updateNotification(UUID id, NotificationDto dto);

    NotificationDto getNotificationById(UUID id);

    List<NotificationDto> getAllNotifications();

    List<NotificationDto> getByUserId(UUID userId);

    List<NotificationDto> getUnreadByUserId(UUID userId);

    void deleteNotification(UUID id);
}
