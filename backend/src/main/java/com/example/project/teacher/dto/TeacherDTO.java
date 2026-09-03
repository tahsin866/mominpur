package com.example.project.teacher.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class TeacherDTO {
    private Long id;
    private String name;
    private String fatherName;
    private String phone;
    private String department;
    private String occupation;
    private String occupationDetails;
    private String teachingFrom;
    private String teachingTo;
    private String division;
    private String district;
    private String thana;
    private String addressDetails;
    private LocalDateTime createdAt;
}
