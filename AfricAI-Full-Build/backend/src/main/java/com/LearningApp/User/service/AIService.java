package com.LearningApp.User.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIService {
    
    @Value("${gemini.api.key}")
    private String geminiApiKey;
    
    public String getGeminiApiKey() {
        return geminiApiKey;
    }
    
    public boolean isApiKeyConfigured() {
        return geminiApiKey != null && !geminiApiKey.isEmpty() && !geminiApiKey.equals("your-google-gemini-api-key");
    }
}
