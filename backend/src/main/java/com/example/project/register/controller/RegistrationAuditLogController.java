package com.example.project.register.controller;

import com.example.project.register.model.RegistrationAuditLog;
import com.example.project.register.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://76.13.183.6", "http://abnayemuminpur26.org", "https://abnayemuminpur26.org"})
public class RegistrationAuditLogController {

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<RegistrationAuditLog>> getAll() {
        return ResponseEntity.ok(auditLogService.getAllLogs());
    }

    @GetMapping("/registration/{registrationId}")
    public ResponseEntity<List<RegistrationAuditLog>> getByRegistration(@PathVariable Long registrationId) {
        return ResponseEntity.ok(auditLogService.getLogsByRegistration(registrationId));
    }
}
