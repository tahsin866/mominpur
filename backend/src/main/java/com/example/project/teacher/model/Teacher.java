package com.example.project.teacher.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "teachers")
@Data
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String fatherName;

    @Column(nullable = false)
    private String phone;

    private String department;

    private String occupation;

    @Column(name = "occupation_details")
    private String occupationDetails;

    @Column(name = "teaching_from")
    private String teachingFrom;

    @Column(name = "teaching_to")
    private String teachingTo;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
