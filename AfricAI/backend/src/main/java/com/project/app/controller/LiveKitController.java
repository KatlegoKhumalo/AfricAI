package com.project.app.controller;

import com.project.app.service.LiveKitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/livekit")
public class LiveKitController {

    private final LiveKitService liveKitService;

    public LiveKitController(LiveKitService liveKitService) {
        this.liveKitService = liveKitService;
    }

    // Generates a LiveKit access token (JWT) for a participant to join a room
    @GetMapping("/token")
    public ResponseEntity<Map<String, String>> getToken(@RequestParam String room, @RequestParam String participant) {
        try {
            Map<String, String> resp = liveKitService.generateAccessToken(room, participant);
            return ResponseEntity.ok(resp);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to generate LiveKit token"));
        }
    }
}


