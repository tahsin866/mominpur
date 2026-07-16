package com.example.project.message.controller;

import com.example.project.message.model.Message;
import com.example.project.message.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://abnayemuminpur26.org", "https://abnayemuminpur26.org"})
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping("/submit")
    public ResponseEntity<?> submitMessage(@RequestBody Message message) {
        try {
            if (message.getName() == null || message.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("নাম আবশ্যক।");
            }
            if (message.getMessage() == null || message.getMessage().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("বার্তা আবশ্যক।");
            }
            Message saved = messageService.createMessage(message);
            return ResponseEntity.ok("আপনার বার্তা সফলভাবে পাঠানো হয়েছে।");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("দুঃখিত, সার্ভারে সমস্যা হয়েছে: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Message>> getAll() {
        return ResponseEntity.ok(messageService.getAllMessages());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return messageService.getMessageById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(messageService.markAsRead(id));
        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMessage(@PathVariable Long id) {
        try {
            messageService.deleteMessage(id);
            return ResponseEntity.ok("বার্তা মুছে ফেলা হয়েছে।");
        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
