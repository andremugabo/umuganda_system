package com.webtech.umuganda.core.location.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LocationDto {

    private UUID id;

    @NotBlank(message = "Location name is required")
    private String name;

    @NotBlank(message = "Location type is required (PROVINCE, DISTRICT, SECTOR, ...)")
    private String type;

    @NotBlank(message = "Reference code is required")
    private String ref;

    // Optional: null if top-level location
    private UUID parentId;
}
