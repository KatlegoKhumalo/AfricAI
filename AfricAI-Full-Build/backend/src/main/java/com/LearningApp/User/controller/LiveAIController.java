package com.LearningApp.User.controller;

import com.LearningApp.User.security.JwtUtil;
import com.LearningApp.User.service.LiveAIService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/live-ai")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class LiveAIController {
    
    private final LiveAIService liveAIService;
    private final JwtUtil jwtUtil;
    
    @PostMapping("/start-session")
    public ResponseEntity<?> startAISession(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String userId = jwtUtil.getUserIdFromToken(jwt);
            
            Map<String, Object> session = liveAIService.startAISession(userId);
            
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            log.error("Start AI session error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/session-status")
    public ResponseEntity<?> getSessionStatus(
            @RequestHeader("Authorization") String token,
            @RequestParam String userId) {
        try {
            String jwt = token.substring(7);
            jwtUtil.getUserIdFromToken(jwt); // Validate token
            
            Map<String, Object> status = liveAIService.getAISessionStatus(userId);
            
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            log.error("Get session status error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = Map.of("error", message);
        return error;
    }
}
