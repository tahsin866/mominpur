package com.example.project.address.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.project.address.Model.Division;

public interface DivisionRepository extends JpaRepository<Division, Long> {}
