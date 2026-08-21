package com.example.project.register.model;

import jakarta.persistence.*;
import lombok.Data;

/**
 * ঠিকানা — registration_id (ছাত্রদের জন্য) অথবা teacher_id (শিক্ষকদের জন্য) দুটির একটি সেট করা থাকে।
 * ছাত্রদের বিপরীতে দুটি সারি (PERMANENT + CURRENT); শিক্ষকদের একটি সারি (PERMANENT)।
 */
@Entity
@Table(name = "addresses")
@Data
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "registration_id")
    private Long registrationId;

    @Column(name = "teacher_id")
    private Long teacherId;

    @Enumerated(EnumType.STRING)
    @Column(name = "address_type", nullable = false)
    private AddressType addressType;

    private String division;

    private String district;

    private String thana;

    private String country;

    @Column(name = "address_details", columnDefinition = "TEXT")
    private String addressDetails;
}
