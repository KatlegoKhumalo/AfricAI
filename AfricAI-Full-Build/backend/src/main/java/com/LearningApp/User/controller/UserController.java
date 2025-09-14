package com.LearningApp.User.controller;

import com.LearningApp.User.DTO.PaymentMethodRequest;
import com.LearningApp.User.model.User;
import com.LearningApp.User.security.JwtUtil;
import com.LearningApp.User.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class UserController {
    
    private final UserService userService;
    private final JwtUtil jwtUtil;
    
    @PutMapping("/me/payment-method")
    public ResponseEntity<?> updatePaymentMethod(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody PaymentMethodRequest paymentRequest) {
        try {
            String jwt = token.substring(7);
            String userId = jwtUtil.getUserIdFromToken(jwt);
            
            User user = userService.updatePaymentMethod(userId, paymentRequest);
            user.setPassword(null);
            
            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Update payment method error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getAllUsers(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String role = jwtUtil.getRoleFromToken(jwt);
            
            if (!"admin".equals(role)) {
                return ResponseEntity.status(403).body(createErrorResponse("Access denied"));
            }
            
            List<User> users = userService.getAllUsers();
            users.forEach(user -> user.setPassword(null));
            
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            log.error("Get all users error: {}", e.getMessage());
            return ResponseEntity.status(401).body(createErrorResponse("Invalid token"));
        }
    }
    
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(
            @RequestHeader("Authorization") String token,
            @PathVariable String userId,
            @RequestBody User updatedUser) {
        try {
            String jwt = token.substring(7);
            String role = jwtUtil.getRoleFromToken(jwt);
            
            if (!"admin".equals(role)) {
                return ResponseEntity.status(403).body(createErrorResponse("Access denied"));
            }
            
            User user = userService.updateUser(userId, updatedUser);
            user.setPassword(null);
            
            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Update user error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(
            @RequestHeader("Authorization") String token,
            @PathVariable String userId) {
        try {
            String jwt = token.substring(7);
            String role = jwtUtil.getRoleFromToken(jwt);
            
            if (!"admin".equals(role)) {
                return ResponseEntity.status(403).body(createErrorResponse("Access denied"));
            }
            
            userService.deleteUser(userId);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "User deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Delete user error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/tutors")
    public ResponseEntity<?> getTutors() {
        try {
            List<User> tutors = userService.getActiveTutors();
            tutors.forEach(tutor -> tutor.setPassword(null));
            
            return ResponseEntity.ok(tutors);
        } catch (Exception e) {
            log.error("Get tutors error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/tutors/{tutorId}")
    public ResponseEntity<?> getTutorProfile(@PathVariable String tutorId) {
        try {
            User tutor = userService.findById(tutorId)
                    .orElseThrow(() -> new RuntimeException("Tutor not found"));
            
            if (!"tutor".equals(tutor.getRole())) {
                return ResponseEntity.badRequest().body(createErrorResponse("User is not a tutor"));
            }
            
            tutor.setPassword(null);
            
            Map<String, Object> response = new HashMap<>();
            response.put("tutor", tutor);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Get tutor profile error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}
