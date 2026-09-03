package com.example.project.teacher.service;

import com.example.project.register.model.Address;
import com.example.project.register.model.AddressType;
import com.example.project.register.repository.AddressRepository;
import com.example.project.teacher.dto.TeacherDTO;
import com.example.project.teacher.model.Teacher;
import com.example.project.teacher.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
    public TeacherDTO createTeacher(Teacher teacher, String division, String district, String thana, String addressDetails) {
        validate(teacher);
        Teacher saved = teacherRepository.save(teacher);
        saveAddress(saved.getId(), division, district, thana, addressDetails);
        return toDto(saved);
    }

    @Transactional
    public TeacherDTO updateTeacher(Long id, Teacher updated, String division, String district, String thana, String addressDetails) {
        Teacher teacher = findTeacher(id);
        validate(updated);
        teacher.setName(updated.getName());
        teacher.setFatherName(updated.getFatherName());
        teacher.setPhone(updated.getPhone());
        teacher.setDepartment(updated.getDepartment());
        teacher.setOccupation(updated.getOccupation());
        teacher.setOccupationDetails(updated.getOccupationDetails());
        teacher.setTeachingFrom(updated.getTeachingFrom());
        teacher.setTeachingTo(updated.getTeachingTo());
        teacherRepository.save(teacher);
        saveAddress(id, division, district, thana, addressDetails);
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

    private void validate(Teacher teacher) {
        if (teacher.getName() == null || teacher.getName().isBlank()) {
            throw new RuntimeException("শিক্ষকের নাম দিতে হবে");
        }
        if (teacher.getPhone() == null || teacher.getPhone().isBlank()) {
            throw new RuntimeException("মোবাইল নম্বর দিতে হবে");
        }
    }

    /** শিক্ষকের ঠিকানা addresses টেবিলে PERMANENT টাইপে সেভ/আপডেট হয়। */
    private void saveAddress(Long teacherId, String division, String district, String thana, String addressDetails) {
        List<Address> existing = addressRepository.findByTeacherId(teacherId);
        Address address = existing.isEmpty() ? new Address() : existing.get(0);
        address.setTeacherId(teacherId);
        address.setAddressType(AddressType.PERMANENT);
        address.setDivision(division);
        address.setDistrict(district);
        address.setThana(thana);
        address.setAddressDetails(addressDetails);
        addressRepository.save(address);
    }

    private TeacherDTO toDto(Teacher t) {
        List<Address> addresses = addressRepository.findByTeacherId(t.getId());
        Address a = addresses.isEmpty() ? null : addresses.get(0);
        return toDto(t,
                a != null ? a.getDivision() : null,
                a != null ? a.getDistrict() : null,
                a != null ? a.getThana() : null,
                a != null ? a.getAddressDetails() : null);
    }

    private TeacherDTO toDto(Teacher t, String division, String district, String thana, String addressDetails) {
        return new TeacherDTO(t.getId(), t.getName(), t.getFatherName(), t.getPhone(), t.getDepartment(),
                t.getOccupation(), t.getOccupationDetails(), t.getTeachingFrom(), t.getTeachingTo(),
                division, district, thana, addressDetails, t.getCreatedAt());
    }
}
