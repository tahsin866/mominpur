package com.example.project.register.service;

import com.example.project.register.dto.RegistrationDTO;
import com.example.project.register.model.Address;
import com.example.project.register.model.AddressType;
import com.example.project.register.model.Registration;
import com.example.project.register.model.Transaction;
import com.example.project.register.repository.AddressRepository;
import com.example.project.register.repository.RegistrationRepository;
import com.example.project.register.repository.TransactionRepository;
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
    private TransactionRepository transactionRepository;

    @Autowired
    private AuditLogService auditLogService;

    @Transactional
    public RegistrationDTO createRegistration(RegistrationDTO dto) {
        if (dto.getPhone() == null || !dto.getPhone().matches("^\\d{11}$")) {
            throw new RuntimeException("মোবাইল নম্বর অবশ্যই ১১ ডিজিটের হতে হবে।");
        }
        if (dto.getWhatsapp() == null || !dto.getWhatsapp().matches("^\\d{11}$")) {
            throw new RuntimeException("হোয়াটসঅ্যাপ নম্বর অবশ্যই ১১ ডিজিটের হতে হবে।");
        }
        if (registrationRepository.findByPhone(dto.getPhone()).isPresent()) {
            throw new RuntimeException("DUPLICATE_PHONE: এই মোবাইল নম্বর (" + dto.getPhone() + ") দিয়ে ইতোমধ্যে রেজিস্ট্রেশন করা হয়েছে। একই মোবাইল নম্বর দিয়ে পুনরায় রেজিস্ট্রেশন করা যাবে না।");
        }
        if (registrationRepository.existsByWhatsapp(dto.getWhatsapp())) {
            throw new RuntimeException("DUPLICATE_WHATSAPP: এই হোয়াটসঅ্যাপ নম্বর (" + dto.getWhatsapp() + ") দিয়ে ইতোমধ্যে রেজিস্ট্রেশন করা হয়েছে। একই হোয়াটসঅ্যাপ নম্বর দিয়ে পুনরায় রেজিস্ট্রেশন করা যাবে না।");
        }
        Registration registration = new Registration();
        copyFields(registration, dto);
        registration.setGuestCount(FeeCalculator.normalizeGuestCount(dto.getGuestCount()));
        if (registration.getStatus() == null) {
            registration.setStatus("PENDING");
        }
        Registration saved = registrationRepository.save(registration);
        // ঠিকানা registrations টেবিলে নেই — আলাদা addresses টেবিলে যায়।
        saveAddresses(saved, dto);
        auditLogService.log("CREATE", saved.getId(), "নতুন রেজিস্ট্রেশন তৈরি হয়েছে", null, buildResponse(saved, dto), currentUser());
        return buildResponse(saved, dto);
    }

    public List<RegistrationDTO> getAllRegistrations() {
        List<Registration> registrations = registrationRepository.findAll();
        return attachAddresses(registrations);
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

    public Optional<RegistrationDTO> getRegistrationById(Long id) {
        return registrationRepository.findById(id).map(this::attachAddresses);
    }

    public Optional<RegistrationDTO> getRegistrationByPhone(String phone) {
        return registrationRepository.findByPhone(phone).map(this::attachAddresses);
    }

    @Transactional
    public Registration updateStatus(Long id, String newStatus) {
        Registration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration not found with id: " + id));
        String oldStatus = registration.getStatus();
        String normalizedStatus = newStatus.toUpperCase();
        registration.setStatus(normalizedStatus);
        Registration saved = registrationRepository.save(registration);

        // Sync linked transaction statuses with registration status
        List<Transaction> transactions = transactionRepository.findByRegistrationId(id);
        for (Transaction tx : transactions) {
            if ("PENDING".equals(tx.getStatus())) {
                tx.setStatus(normalizedStatus);
                transactionRepository.save(tx);
            }
        }

        auditLogService.log("STATUS_UPDATE", id,
                "স্ট্যাটাস পরিবর্তন: " + oldStatus + " → " + saved.getStatus(),
                Map.of("status", oldStatus),
                Map.of("status", saved.getStatus()),
                currentUser());
        return saved;
    }

    @Transactional
    public RegistrationDTO updateRegistration(Long id, RegistrationDTO dto) {
        if (dto.getPhone() == null || !dto.getPhone().matches("^\\d{11}$")) {
            throw new RuntimeException("মোবাইল নম্বর অবশ্যই ১১ ডিজিটের হতে হবে।");
        }
        if (dto.getWhatsapp() == null || !dto.getWhatsapp().matches("^\\d{11}$")) {
            throw new RuntimeException("হোয়াটসঅ্যাপ নম্বর অবশ্যই ১১ ডিজিটের হতে হবে।");
        }
        Registration existing = registrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration not found with id: " + id));
        // পুরনো ঠিকানাও স্ন্যাপশটে থাকা দরকার, নইলে অডিট লগে ঠিকানার পরিবর্তন হারিয়ে যাবে।
        RegistrationDTO oldDto = attachAddresses(existing);
        copyFields(existing, dto);
        // অ্যাডমিন এডিট ফর্ম guestCount পাঠায় না — না পাঠালে আগেরটাই থাকবে, মুছে যাবে না।
        if (dto.getGuestCount() != null) {
            existing.setGuestCount(FeeCalculator.normalizeGuestCount(dto.getGuestCount()));
        }
        Registration saved = registrationRepository.save(existing);
        saveAddresses(saved, dto);
        RegistrationDTO newDto = buildResponse(saved, dto);
        auditLogService.log("UPDATE", id, "রেজিস্ট্রেশন তথ্য আপডেট হয়েছে", oldDto, newDto, currentUser());
        return newDto;
    }

    @Transactional
    public void deleteRegistration(Long id) {
        Registration existing = registrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration not found with id: " + id));
        RegistrationDTO oldDto = attachAddresses(existing);
        auditLogService.log("DELETE", id, "রেজিস্ট্রেশন মুছে ফেলা হয়েছে", oldDto, null, currentUser());
        // foreign key-এর কারণে ঠিকানা ও লেনদেন আগে মুছতে হবে, নইলে ডিলিট আটকে যাবে।
        addressRepository.deleteByRegistrationId(id);
        transactionRepository.deleteByRegistrationId(id);
        registrationRepository.deleteById(id);
    }

    // ------------------------------------------------------------------
    // Mapping helpers: entity ↔ DTO, ঠিকানা: addresses টেবিলের সারি ↔ DTO
    // ------------------------------------------------------------------

    private void copyFields(Registration target, RegistrationDTO source) {
        target.setName(source.getName());
        target.setFatherName(source.getFatherName());
        target.setPhone(source.getPhone());
        target.setWhatsapp(source.getWhatsapp());
        target.setBloodGroup(source.getBloodGroup());
        target.setStudyFrom(source.getStudyFrom());
        target.setStudyTo(source.getStudyTo());
        target.setDepartments(source.getDepartments());
        target.setOccupation(source.getOccupation());
        target.setOccupationDetails(source.getOccupationDetails());
    }

    private RegistrationDTO toDto(Registration r) {
        RegistrationDTO dto = new RegistrationDTO();
        dto.setId(r.getId());
        dto.setName(r.getName());
        dto.setFatherName(r.getFatherName());
        dto.setPhone(r.getPhone());
        dto.setWhatsapp(r.getWhatsapp());
        dto.setBloodGroup(r.getBloodGroup());
        dto.setStudyFrom(r.getStudyFrom());
        dto.setStudyTo(r.getStudyTo());
        dto.setDepartments(r.getDepartments());
        dto.setOccupation(r.getOccupation());
        dto.setOccupationDetails(r.getOccupationDetails());
        dto.setGuestCount(r.getGuestCount());
        dto.setStatus(r.getStatus());
        dto.setSubmittedAt(r.getSubmittedAt());
        return dto;
    }

    /** entity + ফর্ম-সোর্সের ঠিকানা মিলিয়ে API ফেরত দেওয়ার অবজেক্ট বানায়। */
    private RegistrationDTO buildResponse(Registration saved, RegistrationDTO addressSource) {
        RegistrationDTO dto = toDto(saved);
        if (addressSource != null) {
            dto.setPermanentDivision(addressSource.getPermanentDivision());
            dto.setPermanentDistrict(addressSource.getPermanentDistrict());
            dto.setPermanentThana(addressSource.getPermanentThana());
            dto.setPermanentAddressDetails(addressSource.getPermanentAddressDetails());
            dto.setCurrentDivision(addressSource.getCurrentDivision());
            dto.setCurrentDistrict(addressSource.getCurrentDistrict());
            dto.setCurrentThana(addressSource.getCurrentThana());
            dto.setCurrentAddressDetails(addressSource.getCurrentAddressDetails());
        }
        return dto;
    }

    /** ফরম থেকে আসা ঠিকানা দুটি সারি হিসেবে সেভ করে (থাকলে আপডেট, না থাকলে নতুন)। */
    private void saveAddresses(Registration saved, RegistrationDTO source) {
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
    }

    private Address pick(List<Address> addresses, AddressType type) {
        return addresses.stream()
                .filter(a -> a.getAddressType() == type)
                .findFirst()
                .orElseGet(Address::new);
    }

    /** এক রেজিস্ট্রেশনের ঠিকানা addresses টেবিল থেকে তুলে DTO-তে বসায়। */
    private RegistrationDTO attachAddresses(Registration registration) {
        RegistrationDTO dto = toDto(registration);
        applyAddresses(dto, addressRepository.findByRegistrationId(registration.getId()));
        return dto;
    }

    /** তালিকার জন্য — সব ঠিকানা এক কোয়েরিতে এনে বণ্টন করে। */
    private List<RegistrationDTO> attachAddresses(List<Registration> registrations) {
        if (registrations.isEmpty()) {
            return List.of();
        }
        List<Long> ids = registrations.stream().map(Registration::getId).toList();
        Map<Long, List<Address>> byRegistration = addressRepository.findByRegistrationIdIn(ids)
                .stream()
                .collect(Collectors.groupingBy(Address::getRegistrationId));
        return registrations.stream().map(r -> {
            RegistrationDTO dto = toDto(r);
            applyAddresses(dto, byRegistration.getOrDefault(r.getId(), List.of()));
            return dto;
        }).toList();
    }

    private void applyAddresses(RegistrationDTO dto, List<Address> addresses) {
        for (Address address : addresses) {
            if (address.getAddressType() == AddressType.PERMANENT) {
                dto.setPermanentDivision(address.getDivision());
                dto.setPermanentDistrict(address.getDistrict());
                dto.setPermanentThana(address.getThana());
                dto.setPermanentAddressDetails(address.getAddressDetails());
            } else if (address.getAddressType() == AddressType.CURRENT) {
                dto.setCurrentDivision(address.getDivision());
                dto.setCurrentDistrict(address.getDistrict());
                dto.setCurrentThana(address.getThana());
                dto.setCurrentAddressDetails(address.getAddressDetails());
            }
        }
    }

    private String currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal().toString())) {
            return auth.getName();
        }
        return "SYSTEM";
    }
}
