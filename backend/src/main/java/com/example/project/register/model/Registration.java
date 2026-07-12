package com.example.project.register.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "registrations")
@Data
public class Registration {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, name = "father_name")
    private String fatherName;

    @Column(nullable = false, unique = true)
    private String phone;

    @Column(nullable = false)
    private String whatsapp;

    @Column(nullable = false, name = "study_from")
    private String studyFrom;

    @Column(nullable = false, name = "study_to")
    private String studyTo;

    @Column(nullable = false)
    private String departments;

    @Column(name = "permanent_division")
    private String permanentDivision;

    @Column(name = "permanent_district")
    private String permanentDistrict;

    @Column(name = "permanent_thana")
    private String permanentThana;

    @Column(name = "permanent_address_details", columnDefinition = "TEXT")
    private String permanentAddressDetails;

    @Column(name = "current_division")
    private String currentDivision;

    @Column(name = "current_district")
    private String currentDistrict;

    @Column(name = "current_thana")
    private String currentThana;

    @Column(name = "current_address_details", columnDefinition = "TEXT")
    private String currentAddressDetails;

    @Column(nullable = false)
    private String occupation;

    @Column(name = "occupation_details")
    private String occupationDetails;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String status = "PENDING";

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @PrePersist
    protected void onCreate() {
        this.submittedAt = LocalDateTime.now();
    }
}
