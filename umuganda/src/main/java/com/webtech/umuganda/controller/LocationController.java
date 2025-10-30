package com.webtech.umuganda.controller;

import com.webtech.umuganda.core.location.dto.LocationDto;
import com.webtech.umuganda.core.location.service.LocationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
@Tag(name = "Locations", description = "Endpoints for managing hierarchical locations in Umuganda")
public class LocationController {

    private final LocationService locationService;

    @Operation(summary = "Create a new location", description = "Create a new location (Province, District, Sector, ...)")
    @PostMapping
    public ResponseEntity<LocationDto> createLocation(@Valid @RequestBody LocationDto dto) {
        LocationDto created = locationService.createLocation(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Update an existing location", description = "Update location details by ID")
    @PutMapping("/{id}")
    public ResponseEntity<LocationDto> updateLocation(
            @PathVariable UUID id,
            @Valid @RequestBody LocationDto dto) {
        LocationDto updated = locationService.updateLocation(id, dto);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Get all locations", description = "Retrieve all locations")
    @GetMapping
    public ResponseEntity<List<LocationDto>> getAllLocations() {
        return ResponseEntity.ok(locationService.getAllLocations());
    }

    @Operation(summary = "Get a location by ID", description = "Retrieve a single location by its UUID")
    @GetMapping("/{id}")
    public ResponseEntity<LocationDto> getLocationById(@PathVariable UUID id) {
        LocationDto dto = locationService.getLocationById(id);
        return ResponseEntity.ok(dto);
    }

    @Operation(summary = "Get child locations", description = "Retrieve all child locations of a given parent location")
    @GetMapping("/parent/{parentId}")
    public ResponseEntity<List<LocationDto>> getChildren(@PathVariable UUID parentId) {
        List<LocationDto> children = locationService.getChildren(parentId);
        return ResponseEntity.ok(children);
    }

    @Operation(summary = "Get locations by type", description = "Retrieve all locations by type (e.g., PROVINCE, DISTRICT, SECTOR)")
    @GetMapping("/type/{type}")
    public ResponseEntity<List<LocationDto>> getByType(@PathVariable String type) {
        List<LocationDto> locations = locationService.getByType(type.toUpperCase());
        return ResponseEntity.ok(locations);
    }

    @Operation(summary = "Delete a location", description = "Delete a location by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocation(@PathVariable UUID id) {
        locationService.deleteLocation(id);
        return ResponseEntity.noContent().build();
    }
}
