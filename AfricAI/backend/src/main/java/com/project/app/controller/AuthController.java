package com.project.app.controller;

import com.project.app.dto.AuthResponse;
import com.project.app.dto.LoginRequest;
import com.project.app.dto.SignUpRequest;
import com.project.app.dto.UserDto;
import com.project.app.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody SignUpRequest request) {
        // TODO: Add global exception handler for user already exists
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        // TODO: Add global exception handler for bad credentials
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        UserDto currentUser = authService.getCurrentUser();
        // Note: The SecurityConfig will prevent unauthorized access,
        // so this check is an additional safeguard.
        if (currentUser == null) {
            return ResponseEntity.status(401).build(); // Unauthorized
        }
        return ResponseEntity.ok(currentUser);
    }
}
