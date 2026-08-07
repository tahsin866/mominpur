package com.example.project.gallery.controller;

import com.example.project.gallery.model.Photo;
import com.example.project.gallery.service.PhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/photos")
public class PhotoController {

    @Autowired
    private PhotoService photoService;

    @PostMapping("/upload")
    public ResponseEntity<?> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "section", defaultValue = "gallery") String section) {
        try {
            Photo photo = photoService.upload(file, section);
            return ResponseEntity.ok(photo);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Upload failed: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Photo>> getAllPhotos() {
        return ResponseEntity.ok(photoService.getAllPhotos());
    }

    @GetMapping("/section/{section}")
    public ResponseEntity<List<Photo>> getBySection(@PathVariable String section) {
        return ResponseEntity.ok(photoService.getPhotosBySection(section));
    }

    @GetMapping("/{id}/file")
    public ResponseEntity<Resource> getFile(@PathVariable Long id) {
        Photo photo = photoService.getPhoto(id);
        File file = new File(photo.getFilePath());
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        // Detect content type from extension
        MediaType mediaType = MediaType.IMAGE_JPEG;
        String name = file.getName().toLowerCase();
        if (name.endsWith(".png")) mediaType = MediaType.IMAGE_PNG;
        else if (name.endsWith(".gif")) mediaType = MediaType.IMAGE_GIF;
        else if (name.endsWith(".webp")) mediaType = MediaType.parseMediaType("image/webp");
        else if (name.endsWith(".svg")) mediaType = MediaType.parseMediaType("image/svg+xml");

        Resource resource = new FileSystemResource(file);
        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            photoService.deletePhoto(id);
            return ResponseEntity.ok(Map.of("message", "Photo deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
