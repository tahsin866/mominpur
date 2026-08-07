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

    // ---------------------------------------------------------------------
    // ঠিকানা এখন আলাদা `addresses` টেবিলে (দেখুন Address ও AddressType)।
    // নিচের ফিল্ডগুলো @Transient — registrations টেবিলে সেভ হয় না। এগুলো শুধু
    // ফরম থেকে তথ্য নেওয়া আর API-তে ফেরত দেওয়ার জন্য, যাতে ফ্রন্টএন্ডের
    // পুরনো শেপ অক্ষত থাকে। RegistrationService এগুলোকে Address সারিতে অনুবাদ করে।
    // ---------------------------------------------------------------------

    @Transient
    private String permanentDivision;

    @Transient
    private String permanentDistrict;

    @Transient
    private String permanentThana;

    @Transient
    private String permanentAddressDetails;

    @Transient
    private String currentDivision;

    @Transient
    private String currentDistrict;

    @Transient
    private String currentThana;

    @Transient
    private String currentAddressDetails;

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
