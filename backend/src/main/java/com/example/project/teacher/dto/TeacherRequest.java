package com.example.project.teacher.dto;

import lombok.Data;

@Data
public class TeacherRequest {
    private String name;
    private String phone;
    private String department;
    private String division;
    private String district;
    private String thana;
    private String addressDetails;
}
