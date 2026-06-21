package com.lostandfound.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServices {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String itemTitle, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Trustora - Claim Approved! OTP for Exchange");
        message.setText("Your claim for '" + itemTitle + "' has been approved!\n\n" +
                "OTP for exchange: " + otp + "\n\n" +
                "Share this OTP with the item holder during exchange.");
        mailSender.send(message);
    }

    public void sendClaimRejectedEmail(String toEmail, String itemTitle) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Trustora - Claim Rejected");
        message.setText("Unfortunately, your claim for '" + itemTitle + "' has been rejected.\n\n" +
                "Please contact support if you believe this is a mistake.");
        mailSender.send(message);
    }

    public void sendSupportRequest(String fromEmail, String fromName, String issue) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("perarasanperarasan03@gmail.com");   // 👈 unga gmail (correct ah type pannunga, "email" extra word remove pannunga)
        message.setSubject("Trustora Support Request from " + fromName);
        message.setText("From: " + fromName + " (" + fromEmail + ")\n\n" +
                "Issue:\n" + issue);
        mailSender.send(message);
    }
}