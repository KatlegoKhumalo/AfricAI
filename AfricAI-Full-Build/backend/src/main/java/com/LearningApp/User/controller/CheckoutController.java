package com.LearningApp.User.controller;

import com.LearningApp.User.DTO.EnrollmentRequest;
import com.LearningApp.User.DTO.SubscriptionRequest;
import com.LearningApp.User.model.Enrollment;
import com.LearningApp.User.model.Transaction;
import com.LearningApp.User.security.JwtUtil;
import com.LearningApp.User.service.EnrollmentService;
import com.LearningApp.User.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/checkout")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class CheckoutController {
    
    private final EnrollmentService enrollmentService;
    private final TransactionService transactionService;
    private final JwtUtil jwtUtil;
    
    @PostMapping("/enroll")
    public ResponseEntity<?> enrollInCourse(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody EnrollmentRequest enrollmentRequest) {
        try {
            String jwt = token.substring(7);
            String userId = jwtUtil.getUserIdFromToken(jwt);
            String role = jwtUtil.getRoleFromToken(jwt);
            
            if (!"learner".equals(role)) {
                return ResponseEntity.status(403).body(createErrorResponse("Access denied"));
            }
            
            Enrollment enrollment = enrollmentService.enrollInCourse(userId, enrollmentRequest);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Enrollment successful");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Enrollment error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    @PostMapping("/tutors/subscribe")
    public ResponseEntity<?> subscribeTutor(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody SubscriptionRequest subscriptionRequest) {
        try {
            String jwt = token.substring(7);
            String userId = jwtUtil.getUserIdFromToken(jwt);
            String role = jwtUtil.getRoleFromToken(jwt);
            
            if (!"tutor".equals(role)) {
                return ResponseEntity.status(403).body(createErrorResponse("Access denied"));
            }
            
            Transaction transaction = transactionService.createTutorSubscription(userId, subscriptionRequest);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Subscription activated");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Subscription error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}
