package com.webtech.umuganda.controller;

import com.webtech.umuganda.core.notification.dto.NotificationDto;
import com.webtech.umuganda.core.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "APIs for managing notifications")
public class NotificationController {

    private final NotificationService service;

    @Operation(summary = "Create a new notification")
    @PostMapping
    public ResponseEntity<NotificationDto> createNotification(@RequestBody NotificationDto dto) {
        return ResponseEntity.ok(service.createNotification(dto));
    }

    @Operation(summary = "Update a notification")
    @PutMapping("/{id}")
    public ResponseEntity<NotificationDto> updateNotification(@PathVariable UUID id, @RequestBody NotificationDto dto) {
        return ResponseEntity.ok(service.updateNotification(id, dto));
    }

    @Operation(summary = "Get notification by ID")
    @GetMapping("/{id}")
    public ResponseEntity<NotificationDto> getNotificationById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getNotificationById(id));
    }

    @Operation(summary = "Get all notifications")
    @GetMapping
    public ResponseEntity<List<NotificationDto>> getAllNotifications() {
        return ResponseEntity.ok(service.getAllNotifications());
    }

    @Operation(summary = "Get all notifications for a specific user")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDto>> getByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(service.getByUserId(userId));
    }

    @Operation(summary = "Get unread notifications for a specific user")
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<NotificationDto>> getUnreadByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(service.getUnreadByUserId(userId));
    }

    @Operation(summary = "Delete a notification")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable UUID id) {
        service.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }
}

