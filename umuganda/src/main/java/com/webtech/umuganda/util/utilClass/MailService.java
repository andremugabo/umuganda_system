package com.webtech.umuganda.util.utilClass;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;

    private final String FROM_EMAIL = "no-reply@umuganda.com"; // replace with your sender email

    /**
     * Send an account verification email with a clickable link
     */
    public void sendVerificationEmail(String toEmail, String verificationLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(FROM_EMAIL);
        message.setTo(toEmail);
        message.setSubject("Verify Your Umuganda Account");
        message.setText("Hello,\n\n" +
                "Thank you for registering. Please click the link below to verify your account:\n\n" +
                verificationLink + "\n\n" +
                "This link will expire in 10 minutes.\n\n" +
                "Best regards,\nUmuganda Team");
        mailSender.send(message);
    }

    /**
     * Send a one-time password (OTP) email
     */
    public void sendOtpEmail(String toEmail, String otpCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(FROM_EMAIL);
        message.setTo(toEmail);
        message.setSubject("Your OTP for Umuganda Account");
        message.setText("Hello,\n\n" +
                "Use the following OTP to complete your action: " + otpCode + "\n" +
                "It will expire in 10 minutes.\n\n" +
                "Best regards,\nUmuganda Team");
        mailSender.send(message);
    }

    /**
     * Send unsubscription confirmation email
     */
    public void sendUnsubscribeEmail(String toEmail, String firstName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(FROM_EMAIL);
        message.setTo(toEmail);
        message.setSubject("Unsubscription Confirmation - Umuganda");
        message.setText("Hello " + firstName + ",\n\n" +
                "We’re sorry to see you go. Your account has been unsubscribed successfully.\n\n" +
                "If this was a mistake or you’d like to restore your account, please contact our support team.\n\n" +
                "Best regards,\nUmuganda Team");
        mailSender.send(message);
    }
}
