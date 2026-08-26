package com.example.project.register.controller;

import com.example.project.register.model.Transaction;
import com.example.project.register.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://76.13.183.6", "http://abnayemuminpur26.org", "https://abnayemuminpur26.org"})
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/submit")
    public ResponseEntity<?> submitTransaction(@RequestBody Transaction transaction) {
        try {
            if (transaction.getTransactionId() == null || transaction.getTransactionId().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("ট্রানজেকশন আইডি আবশ্যক।");
            }
            if (transaction.getPayingNumber() == null || transaction.getPayingNumber().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("পেয়িং নম্বরের শেষ ৪ ডিজিট আবশ্যক।");
            }
            Transaction saved = transactionService.createTransaction(transaction);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("দুঃখিত, সার্ভারে সমস্যা হয়েছে: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Transaction>> getAll() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return transactionService.getTransactionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTransactionId(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        try {
            String transactionId = body.get("transactionId");
            if (transactionId == null || transactionId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("ট্রানজেকশন আইডি আবশ্যক।");
            }
            return ResponseEntity.ok(transactionService.updateTransactionId(id, transactionId.trim()));
        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            return ResponseEntity.ok(transactionService.updateStatus(id, status));
        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id) {
        try {
            transactionService.deleteTransaction(id);
            return ResponseEntity.ok("ট্রানজেকশন মুছে ফেলা হয়েছে।");
        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
