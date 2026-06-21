package com.lostandfound.controller;

import com.lostandfound.service.EmailServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/support")
@CrossOrigin(origins = "*")
public class ContactController {

    @Autowired
    private EmailServices emailServices;

    @PostMapping("/contact")
    public ResponseEntity<String> contactSupport(@RequestBody Map<String, String> request) {
        try {
            emailServices.sendSupportRequest(
                request.get("email"),
                request.get("name"),
                request.get("issue")
            );
            return ResponseEntity.ok("Support request sent successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send request: " + e.getMessage());
        }
    }
}