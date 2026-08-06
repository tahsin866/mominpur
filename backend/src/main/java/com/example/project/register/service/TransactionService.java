package com.example.project.register.service;

import com.example.project.register.model.Registration;
import com.example.project.register.model.Transaction;
import com.example.project.register.repository.RegistrationRepository;
import com.example.project.register.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private RegistrationRepository registrationRepository;

    @Transactional
    public Transaction createTransaction(Transaction transaction) {
        if (transaction.getStatus() == null) {
            transaction.setStatus("PENDING");
        }
        // টাকার অঙ্ক ক্লায়েন্ট যা-ই পাঠাক, সবসময় রেজিস্ট্রেশনের অতিথি সংখ্যা থেকেই হিসাব হয়।
        transaction.setTotalAmount(resolveTotalAmount(transaction.getRegistrationId()));
        return transactionRepository.save(transaction);
    }

    private int resolveTotalAmount(Long registrationId) {
        if (registrationId == null) {
            return FeeCalculator.REGISTRATION_FEE;
        }
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException(
                        "রেজিস্ট্রেশন খুঁজে পাওয়া যায়নি, আইডি: " + registrationId));
        return FeeCalculator.totalAmount(registration.getGuestCount());
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public Optional<Transaction> getTransactionById(Long id) {
        return transactionRepository.findById(id);
    }

    @Transactional
    public Transaction updateStatus(Long id, String newStatus) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
        transaction.setStatus(newStatus.toUpperCase());
        return transactionRepository.save(transaction);
    }

    @Transactional
    public void deleteTransaction(Long id) {
        if (!transactionRepository.existsById(id)) {
            throw new RuntimeException("Transaction not found with id: " + id);
        }
        transactionRepository.deleteById(id);
    }
}
