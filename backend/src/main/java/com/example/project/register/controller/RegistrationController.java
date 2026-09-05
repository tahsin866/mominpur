package com.example.project.register.controller;
import com.example.project.register.dto.RegistrationDTO;
import com.example.project.register.model.Transaction;
import com.example.project.register.service.FeeCalculator;
import com.example.project.register.service.RegistrationService;
import com.example.project.register.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/registrations")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://abnayemuminpur26.org", "https://abnayemuminpur26.org"})
public class RegistrationController {

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/submit")
    public ResponseEntity<?> submitRegistration(@RequestBody RegistrationDTO registration) {
        try {
            RegistrationDTO saved = registrationService.createRegistration(registration);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("দুঃখিত, সার্ভারে কোনো সমস্যা হয়েছে: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(registrationService.getAllRegistrations());
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(registrationService.getStats());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return registrationService.getRegistrationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/check-status")
    public ResponseEntity<?> checkStatus(@RequestParam String phone) {
        return registrationService.getRegistrationByPhone(phone)
                .map(r -> ResponseEntity.ok((Object) Map.of(
                    "id", r.getId(),
                    "name", r.getName(),
                    "phone", r.getPhone(),
                    "status", r.getStatus(),
                    "guestCount", r.getGuestCount() != null ? r.getGuestCount() : 0,
                    "submittedAt", r.getSubmittedAt() != null ? r.getSubmittedAt().toString() : "",
                    "studyFrom", r.getStudyFrom() != null ? r.getStudyFrom() : "",
                    "studyTo", r.getStudyTo() != null ? r.getStudyTo() : "",
                    "fatherName", r.getFatherName() != null ? r.getFatherName() : ""
                )))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/add-guest")
    public ResponseEntity<?> addGuest(@RequestBody Map<String, Object> body) {
        try {
            String phone = (String) body.get("phone");
            int additionalGuests = ((Number) body.get("additionalGuests")).intValue();

            RegistrationDTO reg = registrationService.getRegistrationByPhone(phone)
                    .orElseThrow(() -> new RuntimeException("এই নম্বরে কোনো রেজিস্ট্রেশন পাওয়া যায়নি।"));

            if (!"APPROVED".equals(reg.getStatus())) {
                return ResponseEntity.badRequest().body("শুধুমাত্র অনুমোদিত রেজিস্ট্রেশনে অতিথি যোগ করা যায়।");
            }

            int currentGuests = reg.getGuestCount() != null ? reg.getGuestCount() : 0;
            if (currentGuests + additionalGuests > FeeCalculator.MAX_GUESTS) {
                return ResponseEntity.badRequest().body(
                        "সর্বোচ্চ " + FeeCalculator.MAX_GUESTS + " জন অতিথি অনুমোদিত। আপনার ইতিমধ্যে " + currentGuests + " জন আছে।");
            }

            Transaction transaction = new Transaction();
            transaction.setRegistrationId(reg.getId());
            transaction.setTransactionId((String) body.get("transactionId"));
            transaction.setPayingNumber((String) body.get("payingNumber"));
            transaction.setReceiverNumber((String) body.get("receiverNumber"));
            transaction.setPaidAmount(((Number) body.get("paidAmount")).intValue());
            transaction.setTotalAmount(FeeCalculator.guestAddAmount(additionalGuests));
            transaction.setType("GUEST_ADD");
            transaction.setStatus("PENDING");

            transactionService.createGuestTransaction(transaction);

            return ResponseEntity.ok(Map.of(
                    "message", "অতিথি যোগের আবেদন সফলভাবে জমা হয়েছে। অ্যাডমিন অনুমোদনের পর আপডেট হবে।",
                    "additionalGuests", additionalGuests,
                    "amount", transaction.getTotalAmount()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("সার্ভারে সমস্যা হয়েছে: " + e.getMessage());
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            return ResponseEntity.ok(registrationService.updateStatus(id, status));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRegistration(@PathVariable Long id, @RequestBody RegistrationDTO registration) {
        try {
            return ResponseEntity.ok(registrationService.updateRegistration(id, registration));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRegistration(@PathVariable Long id) {
        try {
            registrationService.deleteRegistration(id);
            return ResponseEntity.ok("রেজিস্ট্রেশন সফলভাবে মুছে ফেলা হয়েছে।");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
