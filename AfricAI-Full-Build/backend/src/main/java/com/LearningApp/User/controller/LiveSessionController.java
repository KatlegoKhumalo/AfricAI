package com.LearningApp.User.controller;

import com.LearningApp.User.DTO.LiveSessionRequest;
import com.LearningApp.User.model.LiveSession;
import com.LearningApp.User.security.JwtUtil;
import com.LearningApp.User.service.LiveSessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/sessions")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class LiveSessionController {
    
    private final LiveSessionService liveSessionService;
    private final JwtUtil jwtUtil;
    
    @PostMapping
    public ResponseEntity<?> createSession(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody LiveSessionRequest sessionRequest) {
        try {
            String jwt = token.substring(7);
            String userId = jwtUtil.getUserIdFromToken(jwt);
            String role = jwtUtil.getRoleFromToken(jwt);
            
            if (!"tutor".equals(role)) {
                return ResponseEntity.status(403).body(createErrorResponse("Access denied"));
            }
            
            LiveSession session = liveSessionService.createSession(userId, sessionRequest);
            
            Map<String, Object> response = new HashMap<>();
            response.put("session", session);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Create session error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getUpcomingSessions() {
        try {
            List<LiveSession> sessions = liveSessionService.getUpcomingSessions();
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            log.error("Get upcoming sessions error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/tutor")
    public ResponseEntity<?> getTutorSessions(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String userId = jwtUtil.getUserIdFromToken(jwt);
            String role = jwtUtil.getRoleFromToken(jwt);
            
            if (!"tutor".equals(role)) {
                return ResponseEntity.status(403).body(createErrorResponse("Access denied"));
            }
            
            List<LiveSession> sessions = liveSessionService.getTutorSessions(userId);
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            log.error("Get tutor sessions error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/student")
    public ResponseEntity<?> getStudentBookedSessions(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String userId = jwtUtil.getUserIdFromToken(jwt);
            String role = jwtUtil.getRoleFromToken(jwt);
            
            if (!"learner".equals(role)) {
                return ResponseEntity.status(403).body(createErrorResponse("Access denied"));
            }
            
            List<LiveSession> sessions = liveSessionService.getStudentBookedSessions(userId);
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            log.error("Get student sessions error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/{sessionId}")
    public ResponseEntity<?> getSessionById(@PathVariable String sessionId) {
        try {
            LiveSession session = liveSessionService.getSessionById(sessionId)
                    .orElseThrow(() -> new RuntimeException("Session not found"));
            
            Map<String, Object> response = new HashMap<>();
            response.put("session", session);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Get session error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{sessionId}")
    public ResponseEntity<?> updateSession(
            @RequestHeader("Authorization") String token,
            @PathVariable String sessionId,
            @Valid @RequestBody LiveSessionRequest sessionRequest) {
        try {
            String jwt = token.substring(7);
            String userId = jwtUtil.getUserIdFromToken(jwt);
            String role = jwtUtil.getRoleFromToken(jwt);
            
            if (!"tutor".equals(role)) {
                return ResponseEntity.status(403).body(createErrorResponse("Access denied"));
            }
            
            LiveSession session = liveSessionService.updateSession(sessionId, userId, sessionRequest);
            
            Map<String, Object> response = new HashMap<>();
            response.put("session", session);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Update session error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{sessionId}")
    public ResponseEntity<?> deleteSession(
            @RequestHeader("Authorization") String token,
            @PathVariable String sessionId) {
        try {
            String jwt = token.substring(7);
            String userId = jwtUtil.getUserIdFromToken(jwt);
            String role = jwtUtil.getRoleFromToken(jwt);
            
            if (!"tutor".equals(role)) {
                return ResponseEntity.status(403).body(createErrorResponse("Access denied"));
            }
            
            liveSessionService.deleteSession(sessionId, userId);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Session deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Delete session error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    @PostMapping("/{sessionId}/book")
    public ResponseEntity<?> bookSession(
            @RequestHeader("Authorization") String token,
            @PathVariable String sessionId) {
        try {
            String jwt = token.substring(7);
            String userId = jwtUtil.getUserIdFromToken(jwt);
            String role = jwtUtil.getRoleFromToken(jwt);
            
            if (!"learner".equals(role)) {
                return ResponseEntity.status(403).body(createErrorResponse("Access denied"));
            }
            
            liveSessionService.bookSession(sessionId, userId);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Booking successful");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Book session error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{sessionId}/cancel")
    public ResponseEntity<?> cancelBooking(
            @RequestHeader("Authorization") String token,
            @PathVariable String sessionId) {
        try {
            String jwt = token.substring(7);
            String userId = jwtUtil.getUserIdFromToken(jwt);
            String role = jwtUtil.getRoleFromToken(jwt);
            
            if (!"learner".equals(role)) {
                return ResponseEntity.status(403).body(createErrorResponse("Access denied"));
            }
            
            liveSessionService.cancelBooking(sessionId, userId);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Booking cancelled successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Cancel booking error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}
