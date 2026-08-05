package com.example.project.register.repository;

import com.example.project.register.model.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    // একই মোবাইল দিয়ে দ্বিতীয়বার যেন রেজিস্ট্রেশন না করতে পারে
    Optional<Registration> findByPhone(String phone);

    long countByStatus(String status);

    List<Registration> findTop5ByOrderBySubmittedAtDesc();

    @Query("SELECT COUNT(r) FROM Registration r WHERE r.submittedAt >= :start AND r.submittedAt < :end")
    long countBySubmittedAtBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}