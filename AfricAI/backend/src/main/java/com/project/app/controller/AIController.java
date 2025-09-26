package com.project.app.controller;

import com.project.app.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
public class AIController {

    private final AIService aiService;

    @Autowired
    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @GetMapping("/get-api-key")
    public ResponseEntity<Map<String, String>> getApiKey() {
        String apiKey = aiService.getApiKey();
        if (apiKey == null || apiKey.isBlank()) {
            return ResponseEntity.status(404).body(Map.of("error", "GEMINI_API_KEY not configured"));
        }
        return ResponseEntity.ok(Map.of("apiKey", apiKey));
    }
}
