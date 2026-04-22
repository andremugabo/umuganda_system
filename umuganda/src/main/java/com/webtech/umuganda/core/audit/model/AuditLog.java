package com.webtech.umuganda.core.audit.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "action", nullable = false)
    private String action; // CREATE, UPDATE, DELETE, LOGIN, EXPORT

    @Column(name = "entity_name")
    private String entityName; // USER, UMUGANDA, LOCATION, etc.

    @Column(name = "entity_id")
    private String entityId;

    @Column(name = "performed_by", nullable = false)
    private String performedBy; // Email of the user

    @Column(name = "details", length = 1000)
    private String details;

    @Column(name = "ip_address")
    private String ipAddress;

    @CreationTimestamp
    @Column(name = "timestamp", updatable = false)
    private LocalDateTime timestamp;
}
