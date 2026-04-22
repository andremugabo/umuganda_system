package com.webtech.umuganda.core.audit.service;

import com.webtech.umuganda.core.audit.model.AuditLog;
import com.webtech.umuganda.core.audit.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository repository;

    @Transactional
    public void log(String action, String entityName, String entityId, String performedBy, String details, String ip) {
        AuditLog log = AuditLog.builder()
                .action(action)
                .entityName(entityName)
                .entityId(entityId)
                .performedBy(performedBy)
                .details(details)
                .ipAddress(ip)
                .build();
        repository.save(log);
    }

    public List<AuditLog> getAllLogs() {
        return repository.findAllByOrderByTimestampDesc();
    }

    public List<AuditLog> getLogsByEntity(String entityName) {
        return repository.findByEntityName(entityName);
    }
}
