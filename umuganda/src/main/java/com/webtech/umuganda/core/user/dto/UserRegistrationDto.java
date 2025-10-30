package com.webtech.umuganda.core.user.dto;

import com.webtech.umuganda.util.enums.user.ERole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRegistrationDto {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String password;
    private ERole role;
    private UUID locationId;
}
