package com.lostandfound.service;

import com.lostandfound.model.Claim;
import com.lostandfound.model.Item;
import com.lostandfound.model.User;
import com.lostandfound.repository.ClaimRepository;
import com.lostandfound.repository.ItemRepository;
import com.lostandfound.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class ClaimService {

    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    
    private EmailServices emailService;

    public Claim createClaim(Long itemId, String message, String email) {
        User claimer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found!"));

        item.setTrackingStatus("CLAIMED");
        itemRepository.save(item);

        Claim claim = new Claim();
        claim.setItem(item);
        claim.setClaimer(claimer);
        claim.setMessage(message);
        claim.setStatus("PENDING");
        return claimRepository.save(claim);
    }

    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }

    public Claim updateClaimStatus(Long claimId, String status) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found!"));
        claim.setStatus(status);
        claimRepository.save(claim);

        if (status.equals("APPROVED")) {
            Item item = claim.getItem();
            String otp = String.valueOf(new Random().nextInt(900000) + 100000);

            item.setMatchOtp(otp);
            item.setMatched(true);
            item.setTrackingStatus("APPROVED");
            itemRepository.save(item);

            // Opposite item-லயும் OTP save பண்ணு
            String oppositeStatus = item.getStatus().equals("LOST") ? "FOUND" : "LOST";
            List<Item> oppositeItems = itemRepository.findByStatus(oppositeStatus);
            for (Item other : oppositeItems) {
                if (other.getCategory() != null &&
                    other.getCategory().equalsIgnoreCase(item.getCategory())) {
                    other.setMatchOtp(otp);
                    other.setMatched(true);
                    other.setTrackingStatus("APPROVED");
                    itemRepository.save(other);
                    break;
                }
            }

            // Email send பண்ணு
            try {
                emailService.sendOtpEmail(
                    claim.getClaimer().getEmail(),
                    item.getTitle(),
                    otp
                );
                System.out.println("OTP Email sent to: " + claim.getClaimer().getEmail());
            } catch (Exception e) {
                System.out.println("Email send failed: " + e.getMessage());
            }

            System.out.println("=================================");
            System.out.println("CLAIM APPROVED!");
            System.out.println("Item: " + item.getTitle());
            System.out.println("Claimer: " + claim.getClaimer().getEmail());
            System.out.println("OTP for exchange: " + otp);
            System.out.println("=================================");
        }

        if (status.equals("REJECTED")) {
            Item item = claim.getItem();
            item.setTrackingStatus("REPORTED");
            itemRepository.save(item);

            // Rejection email send பண்ணு
            try {
                emailService.sendClaimRejectedEmail(
                    claim.getClaimer().getEmail(),
                    item.getTitle()
                );
                System.out.println("Rejection Email sent to: " + claim.getClaimer().getEmail());
            } catch (Exception e) {
                System.out.println("Email send failed: " + e.getMessage());
            }
        }

        return claim;
    }
}