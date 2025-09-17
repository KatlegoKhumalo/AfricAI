package com.project.app.config;

import com.project.app.model.User;
import com.project.app.model.UserRole;
import com.project.app.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail("admin@africai.com").isEmpty()) {
            User admin = new User();
            admin.setName("AfricaiAdmin");
            admin.setEmail("admin@africai.com");
            admin.setPassword(passwordEncoder.encode("@00000000"));
            admin.setRole(UserRole.ADMIN);
            admin.setVerified(true); // Admins should be verified by default
            admin.setJoinDate(new Date());

            userRepository.save(admin);
        }
    }
}
