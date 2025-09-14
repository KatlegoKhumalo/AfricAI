package com.LearningApp.User.controller;

import com.LearningApp.User.DTO.AuthRequest;
import com.LearningApp.User.DTO.AuthResponse;
import com.LearningApp.User.DTO.SignupRequest;
import com.LearningApp.User.model.User;
import com.LearningApp.User.security.JwtUtil;
import com.LearningApp.User.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuthController {
    
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest signupRequest) {
        try {
            User user = userService.createUser(signupRequest);
            String token = jwtUtil.generateToken(user.getId(), user.getRole());
            
            // Remove password from response
            user.setPassword(null);
            
            AuthResponse response = AuthResponse.builder()
                    .token(token)
                    .user(user)
                    .build();
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Signup error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest authRequest) {
        try {
            User user = null;
            
            // Find user based on role and identifier
            if ("tutor".equals(authRequest.getRole())) {
                user = userService.findByPublicId(authRequest.getIdentifier()).orElse(null);
            } else {
                user = userService.findByEmail(authRequest.getIdentifier()).orElse(null);
            }
            
            if (user == null || !passwordEncoder.matches(authRequest.getPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("Invalid credentials"));
            }
            
            if (!user.getRole().equals(authRequest.getRole())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("Invalid role"));
            }
            
            String token = jwtUtil.generateToken(user.getId(), user.getRole());
            
            // Remove password from response
            user.setPassword(null);
            
            AuthResponse response = AuthResponse.builder()
                    .token(token)
                    .user(user)
                    .build();
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Login error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Login failed"));
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7); // Remove "Bearer " prefix
            String userId = jwtUtil.getUserIdFromToken(jwt);
            
            User user = userService.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Remove password from response
            user.setPassword(null);
            
            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Get current user error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Invalid token"));
        }
    }
    
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}
