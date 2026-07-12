package com.example.project.auth.service;

import com.example.project.auth.dto.AuthResponse;
import com.example.project.auth.dto.LoginRequest;
import com.example.project.auth.dto.RegisterRequest;
import com.example.project.auth.model.User;
import com.example.project.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthResponse registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");

        userRepository.save(user);

        return new AuthResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), "Registration successful");
    }

    public AuthResponse loginUser(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        return new AuthResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), "Login successful");
    }
}
