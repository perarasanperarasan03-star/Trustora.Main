package com.lostandfound.service;

import org.springframework.stereotype.Service;
import com.lostandfound.model.User;

@Service
public class TrustScoreService {

    public int calculateScore(User user) {

        int score = 50;

        score += user.getSuccessfulReturns() * 5;

        score += (int)(user.getAverageRating() * 4);

        if(score > 100) {
            score = 100;
        }

        return score;
    }
}