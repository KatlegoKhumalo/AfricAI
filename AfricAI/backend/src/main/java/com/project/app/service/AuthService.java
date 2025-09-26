package com.project.app.service;

import com.project.app.dto.AuthResponse;
import com.project.app.dto.LoginRequest;
import com.project.app.dto.SignUpRequest;
import com.project.app.dto.UserDto;
import com.project.app.mapper.UserMapper;
import com.project.app.model.Enrollment;
import com.project.app.model.User;
import com.project.app.repository.EnrollmentRepository;
import com.project.app.repository.UserRepository;
import com.project.app.security.JwtUtil;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final JavaMailSender mailSender;
    private final EnrollmentRepository enrollmentRepository;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, AuthenticationManager authenticationManager, JavaMailSender mailSender, EnrollmentRepository enrollmentRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.mailSender = mailSender;
        this.enrollmentRepository = enrollmentRepository;
    }

    public AuthResponse register(SignUpRequest signUpRequest) {
        final String emailLower = signUpRequest.getEmail().trim().toLowerCase();
        if (userRepository.findByEmailIgnoreCase(emailLower).isPresent()) {
            // TODO: Use a more specific exception
            throw new IllegalStateException("Email already in use.");
        }

        User user = UserMapper.fromSignUpRequest(signUpRequest);
        user.setPublicId(UUID.randomUUID().toString());
        user.setEmail(emailLower);
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setJoinDate(new Date());
        user.setVerified(true); // TODO: Add email verification flow later

        // If role is TUTOR, generate a 7-digit tutorId that is unique
        if (user.getRole() != null && user.getRole().name().equals("TUTOR")) {
            String tutorId;
            do {
                tutorId = String.format("%07d", (int)(Math.random() * 1_000_0000));
            } while (userRepository.findByTutorId(tutorId).isPresent());
            user.setTutorId(tutorId);
        }

        User savedUser = userRepository.save(user);

        // We need a UserDetails object to generate the token
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(savedUser.getEmail(), savedUser.getPassword(), List.of(new SimpleGrantedAuthority(savedUser.getRole().name())));
        String jwtToken = jwtUtil.generateToken(userDetails);
        return new AuthResponse(jwtToken);
    }

    public AuthResponse login(LoginRequest loginRequest) {
        // Allow either email or 7-digit tutorId
        String identifier = loginRequest.getIdentifier();
        if (identifier == null || identifier.isBlank()) {
            throw new IllegalArgumentException("Identifier is required");
        }

        String emailToAuth;
        if (identifier.contains("@")) {
            emailToAuth = identifier.trim();
        } else if (identifier.matches("^\\d{7}$")) {
            emailToAuth = userRepository.findByTutorId(identifier)
                    .map(User::getEmail)
                    .orElseThrow(() -> new IllegalStateException("Tutor ID not found"));
        } else {
            throw new IllegalArgumentException("Invalid identifier format");
        }

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                emailToAuth,
                loginRequest.getPassword()
            )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // If authentication is successful, generate token
        final UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwtToken = jwtUtil.generateToken(userDetails);
        return new AuthResponse(jwtToken);
    }

    public UserDto getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return null; // Or throw exception
        }
        String userEmail = ((UserDetails) authentication.getPrincipal()).getUsername();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found in database"));

        UserDto userDto = UserMapper.toUserDto(user);

        List<String> enrolledCourseIds = enrollmentRepository.findByUserId(user.getId())
                .stream()
                .map(Enrollment::getCourseId)
                .collect(Collectors.toList());
        userDto.setEnrolledCourses(enrolledCourseIds);

        return userDto;
    }

    public void forgotPassword(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            user.setResetToken(token);
            userRepository.save(user);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("AfricAI Password Reset");
            message.setText("To reset your password, click the link below:\n\n"
                    + "http://localhost:5173/#/reset-password/" + token);
            mailSender.send(message);
        });
    }

    public void resetPassword(String token, String password) {
        userRepository.findByResetToken(token).ifPresent(user -> {
            user.setPassword(passwordEncoder.encode(password));
            user.setResetToken(null);
            userRepository.save(user);
        });
    }
}
