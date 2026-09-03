package com.example.project.student.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class StudentDTO {
    private Long id;
    private String name;
    private String fatherName;
    private String phone;
    private String bloodGroup;
    private String permanentDivision;
    private String permanentDistrict;
    private String permanentThana;
    private String permanentAddressDetails;
    private String currentDivision;
    private String currentDistrict;
    private String currentThana;
    private String currentAddressDetails;
    private LocalDateTime createdAt;
}
