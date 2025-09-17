package com.project.app.service;

import com.project.app.dto.AuthResponse;
import com.project.app.dto.LoginRequest;
import com.project.app.dto.SignUpRequest;
import com.project.app.dto.UserDto;
import com.project.app.mapper.UserMapper;
import com.project.app.model.User;
import com.project.app.repository.UserRepository;
import com.project.app.security.JwtUtil;
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

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(SignUpRequest signUpRequest) {
        if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            // TODO: Use a more specific exception
            throw new IllegalStateException("Email already in use.");
        }

        User user = UserMapper.fromSignUpRequest(signUpRequest);
        user.setPublicId(UUID.randomUUID().toString());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setJoinDate(new Date());
        user.setVerified(true); // TODO: Add email verification flow later

        User savedUser = userRepository.save(user);

        // We need a UserDetails object to generate the token
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(savedUser.getEmail(), savedUser.getPassword(), List.of(new SimpleGrantedAuthority(savedUser.getRole().name())));
        String jwtToken = jwtUtil.generateToken(userDetails);
        return new AuthResponse(jwtToken);
    }

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(),
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
        return UserMapper.toUserDto(user);
    }
}
