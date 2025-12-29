package com.webtech.umuganda.core.user.service;

import com.webtech.umuganda.core.user.dto.AuthResponseDto;
import com.webtech.umuganda.core.user.dto.LoginRequestDto;
import com.webtech.umuganda.core.user.dto.UserRegistrationDto;
import com.webtech.umuganda.core.user.dto.UsersDto;

import java.util.List;
import java.util.UUID;

public interface UsersService {

    /**
     * Authenticate a user and return a token and user details.
     */
    AuthResponseDto login(LoginRequestDto dto);

    /**
     * Register a new user with password.
     */
    UsersDto registerUser(UserRegistrationDto dto);

    /**
     * Update an existing user (without changing password).
     */
    UsersDto updateUser(UUID id, UsersDto dto);

    /**
     * Get a user by their ID.
     */
    UsersDto getUserById(UUID id);

    /**
     * Get all users.
     */
    List<UsersDto> getAllUsers();

    /**
     * Delete a user by ID.
     */
    void deleteUser(UUID id);

    // Get current authenticated user profile
    UsersDto getCurrentUser(String email);

    // Update current authenticated user profile
    UsersDto updateCurrentUser(String email, UsersDto dto);

    /**
     * Verify a user account using email and OTP.
     */
    String verifyUser(String email, String otp);

    /**
     * Initiate password reset flow.
     */
    void forgotPassword(String email);

    /**
     * Verify OTP for password reset.
     */
    boolean verifyForgotPasswordOtp(String email, String otp);

    /**
     * Reset password using OTP.
     */
    void resetPassword(String email, String otp, String newPassword);
}
