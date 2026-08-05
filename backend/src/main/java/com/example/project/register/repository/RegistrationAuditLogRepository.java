package com.example.project.register.repository;

import com.example.project.register.model.RegistrationAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RegistrationAuditLogRepository extends JpaRepository<RegistrationAuditLog, Long> {

    List<RegistrationAuditLog> findAllByOrderByPerformedAtDesc();

    List<RegistrationAuditLog> findByRegistrationIdOrderByPerformedAtDesc(Long registrationId);
}
