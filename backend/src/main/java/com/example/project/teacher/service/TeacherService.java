package com.example.project.teacher.service;

import com.example.project.register.model.Address;
import com.example.project.register.model.AddressType;
import com.example.project.register.repository.AddressRepository;
import com.example.project.teacher.dto.TeacherDTO;
import com.example.project.teacher.dto.TeacherRequest;
import com.example.project.teacher.model.Teacher;
import com.example.project.teacher.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private AddressRepository addressRepository;

    public List<TeacherDTO> getAllTeachers() {
        return teacherRepository.findAllByOrderByNameAsc().stream()
                .map(this::toDto)
                .toList();
    }

    public TeacherDTO getTeacher(Long id) {
        return toDto(findTeacher(id));
    }

    @Transactional
    public TeacherDTO createTeacher(TeacherRequest request) {
        validate(request);
        Teacher teacher = new Teacher();
        applyFields(teacher, request);
        Teacher saved = teacherRepository.save(teacher);
        saveAddresses(saved.getId(), request);
        return toDto(saved);
    }

    @Transactional
    public TeacherDTO updateTeacher(Long id, TeacherRequest request) {
        validate(request);
        Teacher teacher = findTeacher(id);
        applyFields(teacher, request);
        teacherRepository.save(teacher);
        addressRepository.deleteByTeacherId(id);
        saveAddresses(id, request);
        return toDto(teacher);
    }

    @Transactional
    public void deleteTeacher(Long id) {
        addressRepository.deleteByTeacherId(id);
        teacherRepository.delete(findTeacher(id));
    }

    /* ---------------- helpers ---------------- */

    private Teacher findTeacher(Long id) {
        return teacherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("শিক্ষক পাওয়া যায়নি, আইডি: " + id));
    }

    private void validate(TeacherRequest r) {
        if (r.getName() == null || r.getName().isBlank()) {
            throw new RuntimeException("শিক্ষকের নাম দিতে হবে");
        }
        if (r.getPhone() == null || r.getPhone().isBlank()) {
            throw new RuntimeException("মোবাইল নম্বর দিতে হবে");
        }
    }

    private void applyFields(Teacher teacher, TeacherRequest r) {
        teacher.setName(r.getName());
        teacher.setFatherName(r.getFatherName());
        teacher.setPhone(r.getPhone());
        teacher.setDepartment(r.getDepartment());
        teacher.setOccupation(r.getOccupation());
        teacher.setOccupationDetails(r.getOccupationDetails());
        teacher.setTeachingFrom(r.getTeachingFrom());
        teacher.setTeachingTo(r.getTeachingTo());
    }

    private void saveAddresses(Long teacherId, TeacherRequest r) {
        saveAddress(teacherId, AddressType.PERMANENT, r.getPermanentDivision(), r.getPermanentDistrict(), r.getPermanentThana(), r.getPermanentAddressDetails());
        saveAddress(teacherId, AddressType.CURRENT, r.getCurrentDivision(), r.getCurrentDistrict(), r.getCurrentThana(), r.getCurrentAddressDetails());
    }

    private void saveAddress(Long teacherId, AddressType type, String division, String district, String thana, String addressDetails) {
        if ((division == null || division.isBlank()) && (addressDetails == null || addressDetails.isBlank())) {
            return;
        }
        Address address = new Address();
        address.setTeacherId(teacherId);
        address.setAddressType(type);
        address.setDivision(division);
        address.setDistrict(district);
        address.setThana(thana);
        address.setAddressDetails(addressDetails);
        addressRepository.save(address);
    }

    private TeacherDTO toDto(Teacher t) {
        List<Address> addresses = addressRepository.findByTeacherId(t.getId());
        Map<AddressType, Address> byType = addresses.stream()
                .collect(java.util.stream.Collectors.toMap(Address::getAddressType, a -> a));
        Address perm = byType.get(AddressType.PERMANENT);
        Address curr = byType.get(AddressType.CURRENT);
        return new TeacherDTO(t.getId(), t.getName(), t.getFatherName(), t.getPhone(), t.getDepartment(),
                t.getOccupation(), t.getOccupationDetails(), t.getTeachingFrom(), t.getTeachingTo(),
                val(perm, "division"), val(perm, "district"), val(perm, "thana"), val(perm, "details"),
                val(curr, "division"), val(curr, "district"), val(curr, "thana"), val(curr, "details"),
                t.getCreatedAt());
    }

    private String val(Address a, String field) {
        if (a == null) return null;
        return switch (field) {
            case "division" -> a.getDivision();
            case "district" -> a.getDistrict();
            case "thana" -> a.getThana();
            default -> a.getAddressDetails();
        };
    }
}