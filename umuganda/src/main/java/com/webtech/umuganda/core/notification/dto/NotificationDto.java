package com.webtech.umuganda.core.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {

    private UUID id;
    private UUID userId;
    private String message;
    private LocalDateTime date;
    private boolean read;
}
