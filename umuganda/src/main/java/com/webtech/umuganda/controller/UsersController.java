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
    public ResponseEntity<UsersDto> updateUser(@PathVariable UUID id, @RequestBody UsersDto dto) {
        return ResponseEntity.ok(usersService.updateUser(id, dto));
    }

    @Operation(summary = "Get a user by ID")
    @GetMapping("/{id}")
    public ResponseEntity<UsersDto> getUserById(@PathVariable UUID id) {
        return ResponseEntity.ok(usersService.getUserById(id));
    }

    @Operation(summary = "Get all users")
    @GetMapping
    public ResponseEntity<List<UsersDto>> getAllUsers() {
        return ResponseEntity.ok(usersService.getAllUsers());
    }

    @Operation(summary = "Delete a user")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        usersService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Verify a user's email using OTP",
            description = "This endpoint verifies a user's email using a one-time password sent via email.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User verified successfully or already verified"),
            @ApiResponse(responseCode = "400", description = "Invalid or expired OTP or user not found")
    })
    @GetMapping("/verify")
    public ResponseEntity<String> verifyUser(
            @Parameter(description = "User's email address", required = true)
            @RequestParam String email,

            @Parameter(description = "OTP sent to the user's email", required = true)
            @RequestParam String otp) {

        String result = usersService.verifyUser(email, otp);
        if (result.equals("User verified successfully") || result.equals("User already verified")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }
}
