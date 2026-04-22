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
        String adminPassword = PasswordUtil.hashPassword("123456");

        Optional<Users> existingAdmin = usersRepository.findByEmail(adminEmail);

        if (existingAdmin.isEmpty()) {
            Users admin = new Users();
            admin.setFirstName("Admin");
            admin.setLastName("System");
            admin.setEmail(adminEmail);
            admin.setPassword(adminPassword);
            admin.setPhone("0780000000");
            admin.setRole(ERole.ADMIN);
            admin.setVerified(true);
            usersRepository.save(admin);
            System.out.println("Admin user seeded: " + adminEmail);
        } else {
            // Always sync password to avoid stale hash on restart
            Users admin = existingAdmin.get();
            admin.setPassword(adminPassword);
            admin.setVerified(true);
            usersRepository.save(admin);
            System.out.println("Admin password synced for: " + adminEmail);
        }
    }
}
