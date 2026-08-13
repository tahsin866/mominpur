package com.example.project.register.dto;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * রেজিস্ট্রেশন API-র ইনপুট/আউটপুট শেপ। ঠিকানা ফিল্ডগুলো addresses টেবিলে থাকে,
 * কিন্তু ফ্রন্টএন্ডের সাথে ফ্ল্যাট JSON বিনিময়ের জন্য এই DTO-তে রাখা হয়।
 * Registration entity এখন pure JPA — এখানে কোনো ঠিকানা ফিল্ড নেই।
 */
@Data
public class RegistrationDTO {

    private Long id;

    private String name;

    private String fatherName;

    private String phone;

    private String whatsapp;

    private String bloodGroup;

    private String studyFrom;

    private String studyTo;

    private String departments;

    private String permanentDivision;

    private String permanentDistrict;

    private String permanentThana;

    private String permanentAddressDetails;

    private String currentDivision;

    private String currentDistrict;

    private String currentThana;

    private String currentAddressDetails;

    private String occupation;

    private String occupationDetails;

    private Integer guestCount;

    private String status;

    private LocalDateTime submittedAt;
}
