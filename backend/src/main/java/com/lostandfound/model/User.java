package com.lostandfound.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    private LocalDateTime createdAt = LocalDateTime.now();

    @Column
    private String phone;

    private String otp;

    private boolean verified = false;

    private Double latitude;

    private Double longitude;


    // ADD THESE ↓↓↓

    private Integer successfulReturns = 0;

    private Double averageRating = 0.0;

    private Integer trustScore = 50;
}