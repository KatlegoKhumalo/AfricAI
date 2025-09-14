package com.LearningApp.User.controller;

import com.LearningApp.User.security.JwtUtil;
import com.LearningApp.User.service.AIService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AIController {
    
    private final AIService aiService;
    private final JwtUtil jwtUtil;
    
    @GetMapping("/get-api-key")
    public ResponseEntity<?> getApiKey(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            jwtUtil.getUserIdFromToken(jwt); // Validate token
            
            if (!aiService.isApiKeyConfigured()) {
                return ResponseEntity.badRequest().body(createErrorResponse("AI service not configured"));
            }
            
            Map<String, String> response = new HashMap<>();
            response.put("apiKey", aiService.getGeminiApiKey());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Get API key error: {}", e.getMessage());
            return ResponseEntity.status(401).body(createErrorResponse("Invalid token"));
        }
    }
    
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}
