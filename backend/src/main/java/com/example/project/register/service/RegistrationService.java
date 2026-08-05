package com.example.project.register.service;

import com.example.project.register.model.Registration;
import com.example.project.register.repository.RegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class RegistrationService {

    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private AuditLogService auditLogService;

    @Transactional
    public Registration createRegistration(Registration registration) {
        if (registration.getPhone() == null || !registration.getPhone().matches("^\\d{11}$")) {
            throw new RuntimeException("মোবাইল নম্বর অবশ্যই ১১ ডিজিটের হতে হবে।");
        }
        if (registration.getWhatsapp() == null || !registration.getWhatsapp().matches("^\\d{11}$")) {
            throw new RuntimeException("হোয়াটসঅ্যাপ নম্বর অবশ্যই ১১ ডিজিটের হতে হবে।");
        }
        if (registration.getStatus() == null) {
            registration.setStatus("PENDING");
        }
        Registration saved = registrationRepository.save(registration);
        auditLogService.log("CREATE", saved.getId(), "নতুন রেজিস্ট্রেশন তৈরি হয়েছে", null, saved, currentUser());
        return saved;
    }

    public List<Registration> getAllRegistrations() {
        return registrationRepository.findAll();
    }

    public Map<String, Object> getStats() {
        LocalDate today = LocalDate.now();
        long todayCount = registrationRepository.countBySubmittedAtBetween(
                today.atStartOfDay(),
                today.plusDays(1).atStartOfDay()
        );

        List<Map<String, Object>> recent = registrationRepository.findTop5ByOrderBySubmittedAtDesc()
                .stream()
                .map(r -> {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("id", r.getId());
                    item.put("name", r.getName());
                    item.put("phone", r.getPhone());
                    item.put("status", r.getStatus());
                    item.put("submittedAt", r.getSubmittedAt() != null ? r.getSubmittedAt().toString() : "");
                    return item;
                })
                .toList();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("total", registrationRepository.count());
        stats.put("today", todayCount);
        stats.put("pending", registrationRepository.countByStatus("PENDING"));
        stats.put("approved", registrationRepository.countByStatus("APPROVED"));
        stats.put("rejected", registrationRepository.countByStatus("REJECTED"));
        stats.put("recent", recent);
        return stats;
    }

    public Optional<Registration> getRegistrationById(Long id) {
        return registrationRepository.findById(id);
    }

    public Optional<Registration> getRegistrationByPhone(String phone) {
        return registrationRepository.findByPhone(phone);
    }

    @Transactional
    public Registration updateStatus(Long id, String newStatus) {
        Registration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration not found with id: " + id));
        String oldStatus = registration.getStatus();
        registration.setStatus(newStatus.toUpperCase());
        Registration saved = registrationRepository.save(registration);
        auditLogService.log("STATUS_UPDATE", id,
                "স্ট্যাটাস পরিবর্তন: " + oldStatus + " → " + saved.getStatus(),
                Map.of("status", oldStatus),
                Map.of("status", saved.getStatus()),
                currentUser());
        return saved;
    }

    @Transactional
    public Registration updateRegistration(Long id, Registration updated) {
        if (updated.getPhone() == null || !updated.getPhone().matches("^\\d{11}$")) {
            throw new RuntimeException("মোবাইল নম্বর অবশ্যই ১১ ডিজিটের হতে হবে।");
        }
        if (updated.getWhatsapp() == null || !updated.getWhatsapp().matches("^\\d{11}$")) {
            throw new RuntimeException("হোয়াটসঅ্যাপ নম্বর অবশ্যই ১১ ডিজিটের হতে হবে।");
        }
        Registration existing = registrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration not found with id: " + id));
        Map<String, Object> oldSnapshot = auditLogService.toMap(existing);
        existing.setName(updated.getName());
        existing.setFatherName(updated.getFatherName());
        existing.setPhone(updated.getPhone());
        existing.setWhatsapp(updated.getWhatsapp());
        existing.setStudyFrom(updated.getStudyFrom());
        existing.setStudyTo(updated.getStudyTo());
        existing.setDepartments(updated.getDepartments());
        existing.setPermanentDivision(updated.getPermanentDivision());
        existing.setPermanentDistrict(updated.getPermanentDistrict());
        existing.setPermanentThana(updated.getPermanentThana());
        existing.setPermanentAddressDetails(updated.getPermanentAddressDetails());
        existing.setCurrentDivision(updated.getCurrentDivision());
        existing.setCurrentDistrict(updated.getCurrentDistrict());
        existing.setCurrentThana(updated.getCurrentThana());
        existing.setCurrentAddressDetails(updated.getCurrentAddressDetails());
        existing.setOccupation(updated.getOccupation());
        existing.setOccupationDetails(updated.getOccupationDetails());
        Registration saved = registrationRepository.save(existing);
        auditLogService.log("UPDATE", id, "রেজিস্ট্রেশন তথ্য আপডেট হয়েছে", oldSnapshot, saved, currentUser());
        return saved;
    }

    @Transactional
    public void deleteRegistration(Long id) {
        Registration existing = registrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration not found with id: " + id));
        auditLogService.log("DELETE", id, "রেজিস্ট্রেশন মুছে ফেলা হয়েছে", existing, null, currentUser());
        registrationRepository.deleteById(id);
    }

    private String currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal().toString())) {
            return auth.getName();
        }
        return "SYSTEM";
    }
}
