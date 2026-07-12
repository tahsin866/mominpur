package com.example.project.address.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.project.address.Model.District;

public interface DistrictRepository extends JpaRepository<District, Integer> {}
