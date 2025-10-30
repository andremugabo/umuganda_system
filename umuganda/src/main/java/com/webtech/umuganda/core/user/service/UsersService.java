package com.webtech.umuganda.core.user.service;

import com.webtech.umuganda.core.user.dto.UserRegistrationDto;
import com.webtech.umuganda.core.user.dto.UsersDto;

import java.util.List;
import java.util.UUID;

public interface UsersService {

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

    /**
     * Verify a user account using email and OTP.
     */
    String verifyUser(String email, String otp);
}
