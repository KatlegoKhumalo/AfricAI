package com.project.app.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AIService {

    @Value("${google.gemini.api.key}")
    private String apiKey;

    public String getApiKey() {
        return apiKey;
    }
}
