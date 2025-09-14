package com.LearningApp.User.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class LiveAIService {
    
    @Value("${livekit.api.key:}")
    private String livekitApiKey;
    
    @Value("${livekit.api.secret:}")
    private String livekitApiSecret;
    
    @Value("${livekit.ws.url:}")
    private String livekitWsUrl;
    
    public Map<String, Object> startAISession(String userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Generate room token for LiveKit
            String roomToken = generateRoomToken(userId);
            
            response.put("roomToken", roomToken);
            response.put("wsUrl", livekitWsUrl);
            response.put("roomName", "africai-session-" + userId);
            response.put("status", "ready");
            
            // Start the AI agent in the background
            CompletableFuture.runAsync(() -> {
                try {
                    startAIAgent(userId);
                } catch (Exception e) {
                    log.error("Error starting AI agent: {}", e.getMessage());
                }
            });
            
        } catch (Exception e) {
            log.error("Error starting AI session: {}", e.getMessage());
            response.put("error", "Failed to start AI session");
        }
        
        return response;
    }
    
    private String generateRoomToken(String userId) {
        // In a real implementation, you would use the LiveKit SDK to generate a proper token
        // For now, we'll return a placeholder
        return "room-token-" + userId + "-" + System.currentTimeMillis();
    }
    
    private void startAIAgent(String userId) throws IOException, InterruptedException {
        // Start the Python AI agent
        ProcessBuilder processBuilder = new ProcessBuilder(
            "python", 
            "src/main/resources/ai-assistant/agent.py",
            "--room", "africai-session-" + userId,
            "--user", userId
        );
        
        processBuilder.directory(new java.io.File("."));
        Process process = processBuilder.start();
        
        // Log the output
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        String line;
        while ((line = reader.readLine()) != null) {
            log.info("AI Agent: {}", line);
        }
        
        int exitCode = process.waitFor();
        log.info("AI Agent exited with code: {}", exitCode);
    }
    
    public Map<String, Object> getAISessionStatus(String userId) {
        Map<String, Object> status = new HashMap<>();
        status.put("userId", userId);
        status.put("status", "active");
        status.put("roomName", "africai-session-" + userId);
        status.put("capabilities", new String[]{"voice", "video", "text", "screen_share"});
        return status;
    }
}
