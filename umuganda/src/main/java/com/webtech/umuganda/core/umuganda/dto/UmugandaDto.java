package com.webtech.umuganda.core.umuganda.dto;

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
public class UmugandaDto {

    private UUID id;
    private String description;
    private UUID locationId;
    private LocalDateTime date;
}
