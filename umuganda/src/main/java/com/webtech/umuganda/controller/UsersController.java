package com.webtech.umuganda.controller;

import com.webtech.umuganda.core.user.dto.UserRegistrationDto;
import com.webtech.umuganda.core.user.dto.UsersDto;
import com.webtech.umuganda.core.user.service.UsersService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User management APIs")
public class UsersController {

    private final UsersService usersService;

    @Operation(summary = "Register a new user")
    @PostMapping("/register")
    public ResponseEntity<UsersDto> registerUser(@RequestBody UserRegistrationDto dto) {
        return ResponseEntity.ok(usersService.registerUser(dto));
    }

    @Operation(summary = "Update an existing user")
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VILLAGE_CHEF', 'VILLAGE_SOCIAL')")
    public ResponseEntity<UsersDto> updateUser(@PathVariable UUID id, @RequestBody UsersDto dto) {
        return ResponseEntity.ok(usersService.updateUser(id, dto));
    }

    @Operation(summary = "Get a user by ID")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VILLAGE_CHEF', 'VILLAGE_SOCIAL')")
    public ResponseEntity<UsersDto> getUserById(@PathVariable UUID id) {
        return ResponseEntity.ok(usersService.getUserById(id));
    }

    @Operation(summary = "Get all users")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'VILLAGE_CHEF', 'VILLAGE_SOCIAL')")
    public ResponseEntity<List<UsersDto>> getAllUsers() {
        return ResponseEntity.ok(usersService.getAllUsers());
    }

    @Operation(summary = "Delete a user")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        usersService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Verify a user's email using OTP")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User verified successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid or expired OTP")
    })
    @GetMapping("/verify")
    public ResponseEntity<String> verifyUser(
            @RequestParam String email,
            @RequestParam String otp) {
        String result = usersService.verifyUser(email, otp);
        if (result.contains("successfully") || result.contains("already")) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.badRequest().body(result);
    }

    @Operation(summary = "Initiate password reset")
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        usersService.forgotPassword(email);
        return ResponseEntity.ok("OTP sent if account exists");
    }

    @Operation(summary = "Verify password reset OTP")
    @PostMapping("/verify-reset-otp")
    public ResponseEntity<String> verifyResetOtp(@RequestParam String email, @RequestParam String otp) {
        if (usersService.verifyForgotPasswordOtp(email, otp)) {
            return ResponseEntity.ok("OTP verified");
        }
        return ResponseEntity.badRequest().body("Invalid OTP");
    }

    @Operation(summary = "Reset password")
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestParam String email,
            @RequestParam String otp,
            @RequestParam String newPassword) {
        usersService.resetPassword(email, otp, newPassword);
        return ResponseEntity.ok("Password reset successfully");
    }
}
