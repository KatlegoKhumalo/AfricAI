package com.project.app.service;

import com.project.app.dto.AuthResponse;
import com.project.app.dto.LoginRequest;
import com.project.app.dto.SignUpRequest;
import com.project.app.model.User;
import com.project.app.model.UserRole;
import com.project.app.repository.UserRepository;
import com.project.app.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtUtil jwtUtil;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthService authService;

    private SignUpRequest signUpRequest;
    private User user;

    @BeforeEach
    void setUp() {
        signUpRequest = new SignUpRequest();
        signUpRequest.setEmail("test@example.com");
        signUpRequest.setName("Test User");
        signUpRequest.setPassword("password");
        signUpRequest.setRole(UserRole.LEARNER);

        user = new User();
        user.setEmail("test@example.com");
        user.setPassword("hashedPassword");
        user.setRole(UserRole.LEARNER);
    }

    @Test
    void register_Success() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(jwtUtil.generateToken(any())).thenReturn("test-token");

        AuthResponse response = authService.register(signUpRequest);

        assertNotNull(response);
        assertEquals("test-token", response.getAccessToken());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_EmailAlreadyExists_ThrowsException() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

        assertThrows(IllegalStateException.class, () -> authService.register(signUpRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_Success() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(mock(org.springframework.security.core.userdetails.User.class));
        when(jwtUtil.generateToken(any())).thenReturn("test-token");


        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("test-token", response.getAccessToken());
        verify(authenticationManager, times(1)).authenticate(any());
    }
}
