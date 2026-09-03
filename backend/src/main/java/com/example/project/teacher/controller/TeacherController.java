package com.example.project.teacher.controller;

import com.example.project.teacher.dto.TeacherDTO;
import com.example.project.teacher.dto.TeacherRequest;
import com.example.project.teacher.model.Teacher;
import com.example.project.teacher.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teachers")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://76.13.183.6", "http://abnayemuminpur26.org", "https://abnayemuminpur26.org"})
public class TeacherController {

    @Autowired
    private TeacherService teacherService;

    @PostMapping("/add")
    public ResponseEntity<?> create(@RequestBody TeacherRequest request) {
        try {
            Teacher teacher = new Teacher();
            teacher.setName(request.getName());
            teacher.setFatherName(request.getFatherName());
            teacher.setPhone(request.getPhone());
            teacher.setDepartment(request.getDepartment());
            teacher.setOccupation(request.getOccupation());
            teacher.setOccupationDetails(request.getOccupationDetails());
            teacher.setTeachingFrom(request.getTeachingFrom());
            teacher.setTeachingTo(request.getTeachingTo());
            return ResponseEntity.ok(teacherService.createTeacher(teacher, request.getDivision(), request.getDistrict(), request.getThana(), request.getAddressDetails()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<TeacherDTO>> getAll() {
        return ResponseEntity.ok(teacherService.getAllTeachers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(teacherService.getTeacher(id));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody TeacherRequest request) {
        try {
            Teacher teacher = new Teacher();
            teacher.setName(request.getName());
            teacher.setFatherName(request.getFatherName());
            teacher.setPhone(request.getPhone());
            teacher.setDepartment(request.getDepartment());
            teacher.setOccupation(request.getOccupation());
            teacher.setOccupationDetails(request.getOccupationDetails());
            teacher.setTeachingFrom(request.getTeachingFrom());
            teacher.setTeachingTo(request.getTeachingTo());
            return ResponseEntity.ok(teacherService.updateTeacher(id, teacher, request.getDivision(), request.getDistrict(), request.getThana(), request.getAddressDetails()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            teacherService.deleteTeacher(id);
            return ResponseEntity.ok(Map.of("message", "শিক্ষক মুছে ফেলা হয়েছে"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
