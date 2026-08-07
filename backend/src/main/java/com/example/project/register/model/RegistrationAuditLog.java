package com.example.project.register.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "registration_audit_logs")
@Data
public class RegistrationAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String action;

    @Column(columnDefinition = "TEXT")
    private String details;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "new_value", columnDefinition = "jsonb")
    private Map<String, Object> newValue;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "old_value", columnDefinition = "jsonb")
    private Map<String, Object> oldValue;

    @Column(name = "performed_at")
    private LocalDateTime performedAt;

    @Column(name = "performed_by")
    private String performedBy;

    @Column(name = "registration_id")
    private Long registrationId;

    @PrePersist
    protected void onCreate() {
        this.performedAt = LocalDateTime.now();
    }
}
