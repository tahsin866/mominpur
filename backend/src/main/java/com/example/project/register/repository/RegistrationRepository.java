package com.example.project.register.repository;

import com.example.project.register.model.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    // একই মোবাইল দিয়ে দ্বিতীয়বার যেন রেজিস্ট্রেশন না করতে পারে
    Optional<Registration> findByPhone(String phone);
}