package com.example.project.register.service;

import com.example.project.register.model.RegistrationAuditLog;
import com.example.project.register.repository.RegistrationAuditLogRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AuditLogService {

    @Autowired
    private RegistrationAuditLogRepository auditLogRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Transactional
    public void log(String action, Long registrationId, String details,
                    Object oldValue, Object newValue, String performedBy) {
        RegistrationAuditLog entry = new RegistrationAuditLog();
        entry.setAction(action);
        entry.setRegistrationId(registrationId);
        entry.setDetails(details);
        entry.setOldValue(toMap(oldValue));
        entry.setNewValue(toMap(newValue));
        entry.setPerformedBy(performedBy != null && !performedBy.isBlank() ? performedBy : "SYSTEM");
        auditLogRepository.save(entry);
    }

    public List<RegistrationAuditLog> getAllLogs() {
        return auditLogRepository.findAllByOrderByPerformedAtDesc();
    }

    public List<RegistrationAuditLog> getLogsByRegistration(Long registrationId) {
        return auditLogRepository.findByRegistrationIdOrderByPerformedAtDesc(registrationId);
    }

    public Map<String, Object> toMap(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Map<?, ?> map) {
            Map<String, Object> result = new LinkedHashMap<>();
            map.forEach((k, v) -> result.put(String.valueOf(k), v));
            return result;
        }
        try {
            return objectMapper.convertValue(value, new TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            return Map.of("value", String.valueOf(value));
        }
    }
}
