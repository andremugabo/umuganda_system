package com.webtech.umuganda.core.user.service;

import com.webtech.umuganda.core.location.repository.LocationRepository;
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
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setRole(dto.getRole());
        if (dto.getLocationId() != null) {
            locationsRepository.findById(dto.getLocationId())
                    .ifPresent(user::setLocation);
        }
    }

    // -------------------- Service Methods --------------------

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
        String verificationLink = "http://localhost:8080/api/users/verify?email=" + saved.getEmail() + "&otp=" + otpCode;
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

    // -------------------- Optional: Password Check --------------------
    public boolean checkPassword(Users user, String rawPassword) {
        return PasswordUtil.hashPassword(rawPassword).equals(user.getPassword());
    }
}
