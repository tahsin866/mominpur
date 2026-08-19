package com.example.project.register.model;

import jakarta.persistence.*;
import lombok.Data;

/**
 * প্রতি রেজিস্ট্রেশনের বিপরীতে দুটি সারি — একটি PERMANENT, একটি CURRENT।
 * আগে এই তথ্যগুলো registrations টেবিলেই কলাম হিসেবে ছিল।
 */
@Entity
@Table(name = "addresses")
@Data
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "registration_id", nullable = false)
    private Long registrationId;

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
