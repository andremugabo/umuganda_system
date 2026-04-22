package com.webtech.umuganda.controller;

import com.webtech.umuganda.core.attendance.dto.AttendanceDto;
import com.webtech.umuganda.core.attendance.service.AttendanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@Tag(name = "Attendance", description = "APIs for managing attendance")
public class AttendanceController {


    private final AttendanceService service;

    @Operation(summary = "Create a new attendance record")
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'VILLAGE_CHEF', 'VILLAGE_SOCIAL')")
    public ResponseEntity<AttendanceDto> createAttendance(@RequestBody AttendanceDto dto) {
        return ResponseEntity.ok(service.createAttendance(dto));
    }

    @Operation(summary = "Update an attendance record")
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VILLAGE_CHEF', 'VILLAGE_SOCIAL')")
    public ResponseEntity<AttendanceDto> updateAttendance(@PathVariable UUID id, @RequestBody AttendanceDto dto) {
        return ResponseEntity.ok(service.updateAttendance(id, dto));
    }

    @Operation(summary = "Get attendance by ID")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VILLAGE_CHEF', 'VILLAGE_SOCIAL')")
    public ResponseEntity<AttendanceDto> getAttendanceById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getAttendanceById(id));
    }

    @Operation(summary = "Get all attendance records")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'VILLAGE_CHEF', 'VILLAGE_SOCIAL')")
    public ResponseEntity<List<AttendanceDto>> getAllAttendance() {
        return ResponseEntity.ok(service.getAllAttendance());
    }

    @Operation(summary = "Get attendance by user ID")
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VILLAGE_CHEF', 'VILLAGE_SOCIAL', 'VILLAGER')")
    public ResponseEntity<List<AttendanceDto>> getByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(service.getByUserId(userId));
    }

    @Operation(summary = "Get attendance by Umuganda ID")
    @GetMapping("/umuganda/{umugandaId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VILLAGE_CHEF', 'VILLAGE_SOCIAL')")
    public ResponseEntity<List<AttendanceDto>> getByUmugandaId(@PathVariable UUID umugandaId) {
        return ResponseEntity.ok(service.getByUmugandaId(umugandaId));
    }

    @Operation(summary = "Delete attendance by ID")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VILLAGE_CHEF', 'VILLAGE_SOCIAL')")
    public ResponseEntity<Void> deleteAttendance(@PathVariable UUID id) {
        service.deleteAttendance(id);
        return ResponseEntity.noContent().build();
    }
}