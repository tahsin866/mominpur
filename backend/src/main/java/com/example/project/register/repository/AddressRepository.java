package com.example.project.register.repository;

import com.example.project.register.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {

    List<Address> findByRegistrationId(Long registrationId);

    /** তালিকা দেখানোর সময় প্রতিটি রেজিস্ট্রেশনের জন্য আলাদা কোয়েরি এড়াতে। */
    List<Address> findByRegistrationIdIn(Collection<Long> registrationIds);

    void deleteByRegistrationId(Long registrationId);

    List<Address> findByTeacherId(Long teacherId);

    void deleteByTeacherId(Long teacherId);

    List<Address> findByStudentId(Long studentId);

    void deleteByStudentId(Long studentId);
}
