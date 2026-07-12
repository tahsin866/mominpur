package com.example.project.register.service;

import com.example.project.register.model.Registration;
import com.example.project.register.repository.RegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class RegistrationService {

    @Autowired
    private RegistrationRepository registrationRepository;

    @Transactional
    public Registration createRegistration(Registration registration) {
        if (registration.getStatus() == null) {
            registration.setStatus("PENDING");
        }
        return registrationRepository.save(registration);
    }

    public List<Registration> getAllRegistrations() {
        return registrationRepository.findAll();
    }

    public Optional<Registration> getRegistrationById(Long id) {
        return registrationRepository.findById(id);
    }

    @Transactional
    public Registration updateStatus(Long id, String newStatus) {
        Registration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration not found with id: " + id));
        registration.setStatus(newStatus.toUpperCase());
        return registrationRepository.save(registration);
    }

    @Transactional
    public Registration updateRegistration(Long id, Registration updated) {
        Registration existing = registrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration not found with id: " + id));
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
        return registrationRepository.save(existing);
    }

    @Transactional
    public void deleteRegistration(Long id) {
        if (!registrationRepository.existsById(id)) {
            throw new RuntimeException("Registration not found with id: " + id);
        }
        registrationRepository.deleteById(id);
    }
}
