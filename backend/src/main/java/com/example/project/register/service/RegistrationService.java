package com.example.project.register.service;

import com.example.project.register.model.Address;
import com.example.project.register.model.AddressType;
import com.example.project.register.model.Registration;
import com.example.project.register.repository.AddressRepository;
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
import java.util.stream.Collectors;

@Service
public class RegistrationService {

    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private AddressRepository addressRepository;

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
        registration.setGuestCount(FeeCalculator.normalizeGuestCount(registration.getGuestCount()));
        if (registration.getStatus() == null) {
            registration.setStatus("PENDING");
        }
        Registration saved = registrationRepository.save(registration);
        // ঠিকানা registrations টেবিলে নেই — আলাদা addresses টেবিলে যায়।
        saveAddresses(saved, registration);
        auditLogService.log("CREATE", saved.getId(), "নতুন রেজিস্ট্রেশন তৈরি হয়েছে", null, saved, currentUser());
        return saved;
    }

    public List<Registration> getAllRegistrations() {
        List<Registration> registrations = registrationRepository.findAll();
        attachAddresses(registrations);
        return registrations;
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
        return registrationRepository.findById(id).map(this::attachAddresses);
    }

    public Optional<Registration> getRegistrationByPhone(String phone) {
        return registrationRepository.findByPhone(phone).map(this::attachAddresses);
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
        // পুরনো ঠিকানাও স্ন্যাপশটে থাকা দরকার, নইলে অডিট লগে ঠিকানার পরিবর্তন হারিয়ে যাবে।
        attachAddresses(existing);
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
        // অ্যাডমিন এডিট ফর্ম guestCount পাঠায় না — না পাঠালে আগেরটাই থাকবে, মুছে যাবে না।
        if (updated.getGuestCount() != null) {
            existing.setGuestCount(FeeCalculator.normalizeGuestCount(updated.getGuestCount()));
        }
        Registration saved = registrationRepository.save(existing);
        saveAddresses(saved, existing);
        auditLogService.log("UPDATE", id, "রেজিস্ট্রেশন তথ্য আপডেট হয়েছে", oldSnapshot, saved, currentUser());
        return saved;
    }

    @Transactional
    public void deleteRegistration(Long id) {
        Registration existing = registrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration not found with id: " + id));
        attachAddresses(existing);
        auditLogService.log("DELETE", id, "রেজিস্ট্রেশন মুছে ফেলা হয়েছে", existing, null, currentUser());
        // foreign key-এর কারণে ঠিকানা আগে মুছতে হবে, নইলে ডিলিট আটকে যাবে।
        addressRepository.deleteByRegistrationId(id);
        registrationRepository.deleteById(id);
    }

    // ------------------------------------------------------------------
    // ঠিকানা: registrations টেবিলের কলাম ↔ addresses টেবিলের সারি
    // ------------------------------------------------------------------

    /** ফরম থেকে আসা ঠিকানা দুটি সারি হিসেবে সেভ করে (থাকলে আপডেট, না থাকলে নতুন)। */
    private void saveAddresses(Registration saved, Registration source) {
        List<Address> existing = addressRepository.findByRegistrationId(saved.getId());

        Address permanent = pick(existing, AddressType.PERMANENT);
        permanent.setRegistrationId(saved.getId());
        permanent.setAddressType(AddressType.PERMANENT);
        permanent.setDivision(source.getPermanentDivision());
        permanent.setDistrict(source.getPermanentDistrict());
        permanent.setThana(source.getPermanentThana());
        permanent.setAddressDetails(source.getPermanentAddressDetails());

        Address current = pick(existing, AddressType.CURRENT);
        current.setRegistrationId(saved.getId());
        current.setAddressType(AddressType.CURRENT);
        current.setDivision(source.getCurrentDivision());
        current.setDistrict(source.getCurrentDistrict());
        current.setThana(source.getCurrentThana());
        current.setAddressDetails(source.getCurrentAddressDetails());

        addressRepository.saveAll(List.of(permanent, current));

        // ফেরত দেওয়া অবজেক্টেও ঠিকানা থাকুক, যাতে ফ্রন্টএন্ড সাথে সাথেই দেখাতে পারে।
        copyAddressFields(saved, source);
    }

    private Address pick(List<Address> addresses, AddressType type) {
        return addresses.stream()
                .filter(a -> a.getAddressType() == type)
                .findFirst()
                .orElseGet(Address::new);
    }

    /** এক রেজিস্ট্রেশনের ঠিকানা addresses টেবিল থেকে তুলে transient ফিল্ডে বসায়। */
    private Registration attachAddresses(Registration registration) {
        applyAddresses(registration, addressRepository.findByRegistrationId(registration.getId()));
        return registration;
    }

    /** তালিকার জন্য — সব ঠিকানা এক কোয়েরিতে এনে বণ্টন করে। */
    private void attachAddresses(List<Registration> registrations) {
        if (registrations.isEmpty()) {
            return;
        }
        List<Long> ids = registrations.stream().map(Registration::getId).toList();
        Map<Long, List<Address>> byRegistration = addressRepository.findByRegistrationIdIn(ids)
                .stream()
                .collect(Collectors.groupingBy(Address::getRegistrationId));
        registrations.forEach(r ->
                applyAddresses(r, byRegistration.getOrDefault(r.getId(), List.of())));
    }

    private void applyAddresses(Registration registration, List<Address> addresses) {
        for (Address address : addresses) {
            if (address.getAddressType() == AddressType.PERMANENT) {
                registration.setPermanentDivision(address.getDivision());
                registration.setPermanentDistrict(address.getDistrict());
                registration.setPermanentThana(address.getThana());
                registration.setPermanentAddressDetails(address.getAddressDetails());
            } else if (address.getAddressType() == AddressType.CURRENT) {
                registration.setCurrentDivision(address.getDivision());
                registration.setCurrentDistrict(address.getDistrict());
                registration.setCurrentThana(address.getThana());
                registration.setCurrentAddressDetails(address.getAddressDetails());
            }
        }
    }

    private void copyAddressFields(Registration target, Registration source) {
        target.setPermanentDivision(source.getPermanentDivision());
        target.setPermanentDistrict(source.getPermanentDistrict());
        target.setPermanentThana(source.getPermanentThana());
        target.setPermanentAddressDetails(source.getPermanentAddressDetails());
        target.setCurrentDivision(source.getCurrentDivision());
        target.setCurrentDistrict(source.getCurrentDistrict());
        target.setCurrentThana(source.getCurrentThana());
        target.setCurrentAddressDetails(source.getCurrentAddressDetails());
    }

    private String currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal().toString())) {
            return auth.getName();
        }
        return "SYSTEM";
    }
}
