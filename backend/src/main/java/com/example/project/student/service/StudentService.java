package com.example.project.student.service;

import com.example.project.register.model.Address;
import com.example.project.register.model.AddressType;
import com.example.project.register.repository.AddressRepository;
import com.example.project.student.dto.StudentDTO;
import com.example.project.student.dto.StudentRequest;
import com.example.project.student.model.Student;
import com.example.project.student.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AddressRepository addressRepository;

    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAllByOrderByNameAsc().stream()
                .map(this::toDto)
                .toList();
    }

    public StudentDTO getStudent(Long id) {
        return toDto(findStudent(id));
    }

    @Transactional
    public StudentDTO createStudent(StudentRequest request) {
        validate(request);
        Student student = new Student();
        applyFields(student, request);
        Student saved = studentRepository.save(student);
        saveAddresses(saved.getId(), request);
        return toDto(saved);
    }

    @Transactional
    public StudentDTO updateStudent(Long id, StudentRequest request) {
        validate(request);
        Student student = findStudent(id);
        applyFields(student, request);
        studentRepository.save(student);
        addressRepository.deleteByStudentId(id);
        saveAddresses(id, request);
        return toDto(student);
    }

    @Transactional
    public void deleteStudent(Long id) {
        addressRepository.deleteByStudentId(id);
        studentRepository.delete(findStudent(id));
    }

    /* ---------------- helpers ---------------- */

    private Student findStudent(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("শিক্ষার্থী পাওয়া যায়নি, আইডি: " + id));
    }

    private void validate(StudentRequest r) {
        if (r.getName() == null || r.getName().isBlank()) {
            throw new RuntimeException("শিক্ষার্থীর নাম দিতে হবে");
        }
        if (r.getPhone() == null || r.getPhone().isBlank()) {
            throw new RuntimeException("মোবাইল নম্বর দিতে হবে");
        }
    }

    private void applyFields(Student student, StudentRequest r) {
        student.setName(r.getName());
        student.setFatherName(r.getFatherName());
        student.setPhone(r.getPhone());
        student.setBloodGroup(r.getBloodGroup());
    }

    private void saveAddresses(Long studentId, StudentRequest r) {
        saveAddress(studentId, AddressType.PERMANENT, r.getPermanentDivision(), r.getPermanentDistrict(), r.getPermanentThana(), r.getPermanentAddressDetails());
        saveAddress(studentId, AddressType.CURRENT, r.getCurrentDivision(), r.getCurrentDistrict(), r.getCurrentThana(), r.getCurrentAddressDetails());
    }

    private void saveAddress(Long studentId, AddressType type, String division, String district, String thana, String addressDetails) {
        if ((division == null || division.isBlank()) && (addressDetails == null || addressDetails.isBlank())) {
            return;
        }
        Address address = new Address();
        address.setStudentId(studentId);
        address.setAddressType(type);
        address.setDivision(division);
        address.setDistrict(district);
        address.setThana(thana);
        address.setAddressDetails(addressDetails);
        addressRepository.save(address);
    }

    private StudentDTO toDto(Student s) {
        List<Address> addresses = addressRepository.findByStudentId(s.getId());
        Map<AddressType, Address> byType = addresses.stream()
                .collect(java.util.stream.Collectors.toMap(Address::getAddressType, a -> a));
        Address perm = byType.get(AddressType.PERMANENT);
        Address curr = byType.get(AddressType.CURRENT);
        return new StudentDTO(
                s.getId(), s.getName(), s.getFatherName(), s.getPhone(), s.getBloodGroup(),
                val(perm, AddressType.PERMANENT, "division"),
                val(perm, AddressType.PERMANENT, "district"),
                val(perm, AddressType.PERMANENT, "thana"),
                val(perm, AddressType.PERMANENT, "details"),
                val(curr, AddressType.CURRENT, "division"),
                val(curr, AddressType.CURRENT, "district"),
                val(curr, AddressType.CURRENT, "thana"),
                val(curr, AddressType.CURRENT, "details"),
                s.getCreatedAt());
    }

    private String val(Address a, AddressType type, String field) {
        if (a == null) return null;
        return switch (field) {
            case "division" -> a.getDivision();
            case "district" -> a.getDistrict();
            case "thana" -> a.getThana();
            default -> a.getAddressDetails();
        };
    }
}
