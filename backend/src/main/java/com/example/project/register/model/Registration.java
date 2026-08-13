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

    @Column(name = "blood_group")
    private String bloodGroup;

    @Column(nullable = false)
    private String occupation;

    @Column(name = "occupation_details")
    private String occupationDetails;

    /** সাথে আসা অতিথির সংখ্যা — ০, ১ বা ২। টাকার হিসাব transactions টেবিলে। */
    @Column(name = "guest_count", nullable = false, columnDefinition = "INTEGER DEFAULT 0")
    private Integer guestCount = 0;

    @Column(nullable = false)
    private String status = "PENDING";

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @PrePersist
    protected void onCreate() {
        this.submittedAt = LocalDateTime.now();
    }
}
