package com.example.project.config;

import com.example.project.auth.model.User;
import com.example.project.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("khurshed")) {
            User admin = new User();
            admin.setName("Khurshed");
            admin.setEmail("khurshed");
            admin.setPassword(passwordEncoder.encode("khurshed@123"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("Admin user 'khurshed' created successfully.");
        }
        if (!userRepository.existsByEmail("mominpur")) {
            User admin2 = new User();
            admin2.setName("Mominpur");
            admin2.setEmail("mominpur");
            admin2.setPassword(passwordEncoder.encode("admin123"));
            admin2.setRole("ADMIN");
            userRepository.save(admin2);
            System.out.println("Admin user 'mominpur' created successfully.");
        }
    }
}
