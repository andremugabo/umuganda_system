package com.webtech.umuganda.core.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Response object containing authentication token and user data")
public class AuthResponseDto {
    @Schema(description = "Authentication token (UUID string)")
    private String token;

    @Schema(description = "User profile data")
    private UsersDto user;
}
