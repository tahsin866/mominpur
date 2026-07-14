package com.example.project.register.controller;
import com.example.project.register.model.Registration;
import com.example.project.register.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/registrations")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class RegistrationController {

    @Autowired
    private RegistrationService registrationService;

    @PostMapping("/submit")
    public ResponseEntity<?> submitRegistration(@RequestBody Registration registration) {
        try {
            Registration saved = registrationService.createRegistration(registration);
            return ResponseEntity.ok("আলহামদুলিল্লাহ! আপনার ফরমটি সফলভাবে ডাটাবেজে সংরক্ষিত হয়েছে।");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("দুঃখিত, সার্ভারে কোনো সমস্যা হয়েছে: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(registrationService.getAllRegistrations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return registrationService.getRegistrationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
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
    public ResponseEntity<?> updateRegistration(@PathVariable Long id, @RequestBody Registration registration) {
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
