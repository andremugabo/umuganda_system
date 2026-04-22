package com.webtech.umuganda.controller;

import com.webtech.umuganda.core.audit.model.AuditLog;
import com.webtech.umuganda.core.audit.service.AuditLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
@Tag(name = "Audit Logs", description = "System accountability and activity tracking APIs")
public class AuditLogController {

    private final AuditLogService auditLogService;

    @Operation(summary = "Get all system audit logs")
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLog>> getAllLogs() {
        return ResponseEntity.ok(auditLogService.getAllLogs());
    }

    @Operation(summary = "Get logs for a specific entity type")
    @GetMapping("/filter")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLog>> getLogsByEntity(@RequestParam String entityName) {
        return ResponseEntity.ok(auditLogService.getLogsByEntity(entityName));
    }
}
