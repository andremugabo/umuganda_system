package com.webtech.umuganda.controller;

import com.webtech.umuganda.core.umuganda.dto.UmugandaDto;
import com.webtech.umuganda.core.umuganda.service.UmugandaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/umuganda")
@RequiredArgsConstructor
@Tag(name = "Umuganda", description = "APIs for managing Umuganda events")
public class UmugandaController {

    private final UmugandaService service;

    @Operation(summary = "Create a new Umuganda")
    @PostMapping
    public ResponseEntity<UmugandaDto> createUmuganda(@RequestBody UmugandaDto dto) {
        return ResponseEntity.ok(service.createUmuganda(dto));
    }

    @Operation(summary = "Update an existing Umuganda")
    @PutMapping("/{id}")
    public ResponseEntity<UmugandaDto> updateUmuganda(@PathVariable UUID id, @RequestBody UmugandaDto dto) {
        return ResponseEntity.ok(service.updateUmuganda(id, dto));
    }

    @Operation(summary = "Get Umuganda by ID")
    @GetMapping("/{id}")
    public ResponseEntity<UmugandaDto> getUmugandaById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getUmugandaById(id));
    }

    @Operation(summary = "Get all Umuganda events")
    @GetMapping
    public ResponseEntity<List<UmugandaDto>> getAllUmuganda() {
        return ResponseEntity.ok(service.getAllUmuganda());
    }

    @Operation(summary = "Get Umuganda events by location")
    @GetMapping("/location/{locationId}")
    public ResponseEntity<List<UmugandaDto>> getUmugandaByLocation(@PathVariable UUID locationId) {
        return ResponseEntity.ok(service.getUmugandaByLocation(locationId));
    }

    @Operation(summary = "Delete Umuganda by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUmuganda(@PathVariable UUID id) {
        service.deleteUmuganda(id);
        return ResponseEntity.noContent().build();
    }
}
