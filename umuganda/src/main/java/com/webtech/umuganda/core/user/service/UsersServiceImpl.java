package com.webtech.umuganda.core.user.service;

import com.webtech.umuganda.core.location.repository.LocationRepository;
import com.webtech.umuganda.core.user.dto.AuthResponseDto;
import com.webtech.umuganda.core.user.dto.LoginRequestDto;
import com.webtech.umuganda.core.user.dto.UserRegistrationDto;
import com.webtech.umuganda.core.user.dto.UsersDto;
import com.webtech.umuganda.core.user.model.Users;
import com.webtech.umuganda.core.user.repository.UsersRepository;
import com.webtech.umuganda.util.utilClass.MailService;
import com.webtech.umuganda.util.utilClass.PasswordUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UsersServiceImpl implements UsersService {

    private final UsersRepository usersRepository;
    private final LocationRepository locationsRepository;
    private final MailService mailService;

    // -------------------- Mapping Methods --------------------

    private UsersDto mapToDto(Users user) {
        UsersDto dto = new UsersDto();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole());

        if (user.getLocation() != null) {
            dto.setLocationId(user.getLocation().getId());
        }
        return dto;
    }

    private Users mapToEntity(UserRegistrationDto dto) {
        Users user = new Users();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setRole(dto.getRole());
        user.setPassword(PasswordUtil.hashPassword(dto.getPassword())); // HASH password with SHA-256

        if (dto.getLocationId() != null) {
            locationsRepository.findById(dto.getLocationId())
                    .ifPresent(user::setLocation);
        }
        return user;
    }

    private void updateEntityFromDto(Users user, UsersDto dto) {
        if (dto.getFirstName() != null)
            user.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null)
            user.setLastName(dto.getLastName());
        if (dto.getEmail() != null)
            user.setEmail(dto.getEmail());
        if (dto.getPhone() != null)
            user.setPhone(dto.getPhone());
        if (dto.getRole() != null)
            user.setRole(dto.getRole());
        if (dto.getLocationId() != null) {
            locationsRepository.findById(dto.getLocationId())
                    .ifPresent(user::setLocation);
        }
    }

    // -------------------- Service Methods --------------------

    @Override
    public AuthResponseDto login(LoginRequestDto dto) {
        Users user = usersRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!PasswordUtil.hashPassword(dto.getPassword()).equals(user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // TODO: Re-enable email verification check for production
        // if (!user.isVerified()) {
        // throw new RuntimeException("Please verify your email before logging in");
        // }

        // Generate a simple temporary token
        String token = UUID.randomUUID().toString();

        return new AuthResponseDto(token, mapToDto(user));
    }

    @Override
    public UsersDto registerUser(UserRegistrationDto dto) {
        Users user = mapToEntity(dto);

        // Set as not verified
        user.setVerified(false);

        // Generate 6-digit OTP
        String otpCode = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));
        user.setOtpCode(otpCode);

        // Set OTP expiration 10 minutes from now
        user.setOtpExpiresAt(LocalDateTime.now().plusMinutes(10));

        // Save user
        Users saved = usersRepository.save(user);

        // Send verification email
        String verificationLink = "http://localhost:8080/api/users/verify?email=" + saved.getEmail() + "&otp="
                + otpCode;
        mailService.sendVerificationEmail(saved.getEmail(), verificationLink);

        return mapToDto(saved);
    }

    @Override
    public UsersDto updateUser(UUID id, UsersDto dto) {
        Users user = usersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        updateEntityFromDto(user, dto);
        return mapToDto(usersRepository.save(user));
    }

    @Override
    public UsersDto getUserById(UUID id) {
        return usersRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public List<UsersDto> getAllUsers() {
        return usersRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteUser(UUID id) {
        Users user = usersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        usersRepository.delete(user);
    }

    @Override
    public String verifyUser(String email, String otp) {
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isVerified()) {
            return "User already verified";
        }

        if (user.getOtpCode().equals(otp) && user.getOtpExpiresAt().isAfter(LocalDateTime.now())) {
            user.setVerified(true);
            user.setOtpCode(null);
            user.setOtpExpiresAt(null);
            usersRepository.save(user);
            return "User verified successfully";
        } else {
            return "Invalid or expired verification link";
        }
    }

    // Get current authenticated user profile by email
    @Override
    public UsersDto getCurrentUser(String email) {
        return usersRepository.findByEmail(email)
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Update current authenticated user profile by email
    @Override
    public UsersDto updateCurrentUser(String email, UsersDto dto) {
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        updateEntityFromDto(user, dto);
        return mapToDto(usersRepository.save(user));
    }

    // -------------------- Optional: Password Check --------------------
    public boolean checkPassword(Users user, String rawPassword) {
        return PasswordUtil.hashPassword(rawPassword).equals(user.getPassword());
    }

    @Override
    public void forgotPassword(String email) {
        var userOptional = usersRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return; // Fail silently for security
        }
        Users user = userOptional.get();

        // Generate 6-digit OTP
        String otpCode = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));
        user.setOtpCode(otpCode);
        user.setOtpPurpose("PASSWORD_RESET");
        user.setOtpExpiresAt(LocalDateTime.now().plusMinutes(15)); // 15 mins validity for password reset
        usersRepository.save(user);

        // Send email
        String emailBody = "Your OTP for password reset is: " + otpCode + ". It expires in 15 minutes.";
        try {
            mailService.sendVerificationEmail(user.getEmail(), emailBody);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + email + ": " + e.getMessage());
            System.out.println("DEBUG OTP for " + email + ": " + otpCode);
            // In production, you might want to throw the exception or handle it differently
            // allowing it to proceed here for dev/demo purposes so you can see the OTP in
            // logs
        }
    }

    @Override
    public boolean verifyForgotPasswordOtp(String email, String otp) {
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"PASSWORD_RESET".equals(user.getOtpPurpose())) {
            throw new RuntimeException("Invalid OTP purpose");
        }

        if (user.getOtpCode() == null || !user.getOtpCode().equals(otp)) {
            return false;
        }

        if (user.getOtpExpiresAt() == null || user.getOtpExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        return true;
    }

    @Override
    public void resetPassword(String email, String otp, String newPassword) {
        if (!verifyForgotPasswordOtp(email, otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(PasswordUtil.hashPassword(newPassword));
        // Clear OTP
        user.setOtpCode(null);
        user.setOtpExpiresAt(null);
        user.setOtpPurpose(null);

        usersRepository.save(user);
    }
}
