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
        if (userRepository.findByEmail("mominpur").isEmpty()) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail("mominpur");
            admin.setPassword(passwordEncoder.encode("muhsin@123"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("✅ Admin user created: mominpur / muhsin@123");
        }
    }
}
