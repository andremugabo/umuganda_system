package com.webtech.umuganda.core.notification.service;

import com.webtech.umuganda.core.notification.dto.NotificationDto;
import com.webtech.umuganda.core.notification.model.Notification;
import com.webtech.umuganda.core.notification.repository.NotificationRepository;
import com.webtech.umuganda.core.notification.service.NotificationService;
import com.webtech.umuganda.core.user.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository repository;
    private final UsersRepository usersRepository;

    private NotificationDto mapToDto(Notification entity) {
        NotificationDto dto = new NotificationDto();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUser().getId());
        dto.setMessage(entity.getMessage());
        dto.setDate(entity.getDate());
        dto.setRead(entity.isRead());
        return dto;
    }

    private Notification mapToEntity(NotificationDto dto) {
        Notification entity = new Notification();
        usersRepository.findById(dto.getUserId()).ifPresent(entity::setUser);
        entity.setMessage(dto.getMessage());
        entity.setDate(dto.getDate() != null ? dto.getDate() : java.time.LocalDateTime.now());
        entity.setRead(dto.isRead());
        return entity;
    }

    @Override
    public NotificationDto createNotification(NotificationDto dto) {
        Notification saved = repository.save(mapToEntity(dto));
        return mapToDto(saved);
    }

    @Override
    public NotificationDto updateNotification(UUID id, NotificationDto dto) {
        Notification entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        usersRepository.findById(dto.getUserId()).ifPresent(entity::setUser);
        entity.setMessage(dto.getMessage());
        entity.setRead(dto.isRead());
        entity.setDate(dto.getDate());
        return mapToDto(repository.save(entity));
    }

    @Override
    public NotificationDto getNotificationById(UUID id) {
        return repository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
    }

    @Override
    public List<NotificationDto> getAllNotifications() {
        return repository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<NotificationDto> getByUserId(UUID userId) {
        return repository.findByUserId(userId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<NotificationDto> getUnreadByUserId(UUID userId) {
        return repository.findByUserIdAndRead(userId, false).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public void deleteNotification(UUID id) {
        Notification entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        repository.delete(entity);
    }
}
