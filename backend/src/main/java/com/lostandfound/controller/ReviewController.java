package com.lostandfound.controller;

import com.lostandfound.model.Review;
import com.lostandfound.model.User;
import com.lostandfound.repository.ReviewRepository;
import com.lostandfound.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/give")
    public ResponseEntity<String> giveReview(@RequestBody Map<String, String> request) {
        try {
            User fromUser = userRepository.findByEmail(request.get("fromEmail"))
                    .orElseThrow(() -> new RuntimeException("From user not found"));
            User toUser = userRepository.findByEmail(request.get("toEmail"))
                    .orElseThrow(() -> new RuntimeException("To user not found"));

            Review review = new Review();
            review.setFromUser(fromUser);
            review.setToUser(toUser);
            review.setRating(Integer.parseInt(request.get("rating")));
            review.setComment(request.get("comment"));
            reviewRepository.save(review);

            return ResponseEntity.ok("Review submitted successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed: " + e.getMessage());
        }
    }

    @GetMapping("/received/{userId}")
    public ResponseEntity<List<Review>> getReceivedReviews(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewRepository.findByToUserId(userId));
    }

    @GetMapping("/given/{userId}")
    public ResponseEntity<List<Review>> getGivenReviews(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewRepository.findByFromUserId(userId));
    }
}