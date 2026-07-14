package com.example.project.gallery.service;

import com.example.project.gallery.model.Photo;
import com.example.project.gallery.repository.PhotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class PhotoService {

    @Autowired
    private PhotoRepository photoRepository;

    @Value("${upload.dir:uploads}")
    private String uploadDir;

    public Photo upload(MultipartFile file, String section) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        String ext = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            ext = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String filename = UUID.randomUUID() + ext;

        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath);

        Photo photo = new Photo();
        photo.setFilename(filename);
        photo.setOriginalFilename(originalFilename);
        photo.setContentType(file.getContentType());
        photo.setSize(file.getSize());
        photo.setSection(section);

        return photoRepository.save(photo);
    }

    public List<Photo> getAllPhotos() {
        return photoRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Photo> getPhotosBySection(String section) {
        return photoRepository.findBySectionOrderByCreatedAtDesc(section);
    }

    public void deletePhoto(Long id) throws IOException {
        Photo photo = photoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Photo not found"));

        Path filePath = Paths.get(uploadDir).resolve(photo.getFilename());
        Files.deleteIfExists(filePath);

        photoRepository.deleteById(id);
    }
}
