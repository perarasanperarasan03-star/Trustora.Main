package com.lostandfound.repository;

import com.lostandfound.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByToUserId(Long userId);
    List<Review> findByFromUserId(Long userId);
}