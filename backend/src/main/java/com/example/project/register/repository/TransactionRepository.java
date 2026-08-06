package com.example.project.register.repository;

import com.example.project.register.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByRegistrationId(Long registrationId);
}
