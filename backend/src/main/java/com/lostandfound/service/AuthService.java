package com.lostandfound.service;

import com.lostandfound.dto.LoginRequest;

import com.lostandfound.dto.RegisterRequest;
import com.lostandfound.model.User;
import com.lostandfound.repository.UserRepository;
import com.lostandfound.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.HashMap;

import java.util.Random;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }
        String otp = String.valueOf(new Random().nextInt(900000) + 100000);
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        user.setOtp(otp);
        user.setVerified(false);
        userRepository.save(user);
        System.out.println("OTP for " + request.getEmail() + ": " + otp);
        return "OTP sent! Check console: " + otp;
    }

    public String verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        if (user.getOtp().equals(otp)) {
            user.setVerified(true);
            userRepository.save(user);
            return "Email verified successfully!";
        }
        throw new RuntimeException("Invalid OTP!");
    }

    public Map<String, String> login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found!"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password!");
        }
        Map<String, String> response = new HashMap<>();
        response.put("token", jwtUtil.generateToken(user.getEmail()));
        response.put("role", user.getRole());
        return response;
    }
}