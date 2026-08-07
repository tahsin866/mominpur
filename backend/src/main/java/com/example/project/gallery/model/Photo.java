package com.example.project.gallery.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "photos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filePath;

    private String contentType;

    private Long size;

    private String section;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
