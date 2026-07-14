package com.example.project.gallery.repository;

import com.example.project.gallery.model.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PhotoRepository extends JpaRepository<Photo, Long> {
    List<Photo> findBySectionOrderByCreatedAtDesc(String section);
    List<Photo> findAllByOrderByCreatedAtDesc();
}
