package com.lostandfound.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    private String category;

    @Column(nullable = false)
    private String status; // LOST or FOUND

    private String location;

    private String imageUrl;

    private LocalDateTime reportedDate = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    private Double latitude;
    private Double longitude;
    
    private boolean matched = false;
    private String matchOtp;
    
    private String trackingStatus = "REPORTED";
 // REPORTED → MATCHED → CLAIMED → APPROVED → RETURNED
}