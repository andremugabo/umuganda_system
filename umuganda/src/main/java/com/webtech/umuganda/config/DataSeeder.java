package com.webtech.umuganda.config;

import com.webtech.umuganda.core.user.model.Users;
import com.webtech.umuganda.core.user.repository.UsersRepository;
import com.webtech.umuganda.util.enums.user.ERole;
import com.webtech.umuganda.util.utilClass.PasswordUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Optional;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final UsersRepository usersRepository;

    @Bean
    public CommandLineRunner seedData() {
        return args -> {
            seedAdminUser();
        };
    }

    private void seedAdminUser() {
        String adminEmail = "muhimpundumamy@gmail.com";
        Optional<Users> existingAdmin = usersRepository.findByEmail(adminEmail);

        if (existingAdmin.isEmpty()) {
            Users admin = new Users();
            admin.setFirstName("Admin");
            admin.setLastName("System");
            admin.setEmail(adminEmail);
            admin.setPassword(PasswordUtil.hashPassword("12345678"));
            admin.setPhone("0780000000"); // Placeholder phone
            admin.setRole(ERole.ADMIN);
            admin.setVerified(true); // Pre-verify the admin

            usersRepository.save(admin);
            System.out.println("Admin user seeded successfully: " + adminEmail);
        } else {
            System.out.println("Admin user already exists, skipping seeding.");
        }
    }
}
