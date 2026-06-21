package com.lostandfound.controller;

import com.lostandfound.model.Claim;
import com.lostandfound.service.ClaimService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
@CrossOrigin(origins = "http://localhost:3000")
public class ClaimController {

    @Autowired
    private ClaimService claimService;

    @PostMapping("/{itemId}")
    public ResponseEntity<Claim> createClaim(@PathVariable Long itemId,
                                              @RequestParam String message,
                                              Authentication authentication) {
        return ResponseEntity.ok(claimService.createClaim(itemId, message, authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<List<Claim>> getAllClaims() {
        return ResponseEntity.ok(claimService.getAllClaims());
    }

    @PutMapping("/{claimId}/status")
    public ResponseEntity<Claim> updateStatus(@PathVariable Long claimId,
                                               @RequestParam String status) {
        return ResponseEntity.ok(claimService.updateClaimStatus(claimId, status));
    }
}