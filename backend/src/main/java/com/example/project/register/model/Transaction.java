package com.example.project.register.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "registration_id")
    private Long registrationId;

    @Column(nullable = false, name = "transaction_id")
    private String transactionId;

    @Column(nullable = false, name = "paying_number")
    private String payingNumber;

    /** রেজিস্ট্রেশন ফি + অতিথি ফি। সার্ভারে হিসাব হয়, ক্লায়েন্ট থেকে নেওয়া হয় না। */
    @Column(name = "total_amount", nullable = false, columnDefinition = "INTEGER DEFAULT 1020")
    private Integer totalAmount = 1020;

    @Column(nullable = false)
    private String status = "PENDING";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
