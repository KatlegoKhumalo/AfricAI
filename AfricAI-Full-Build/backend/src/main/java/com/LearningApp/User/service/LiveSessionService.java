package com.LearningApp.User.service;

import com.LearningApp.User.DTO.LiveSessionRequest;
import com.LearningApp.User.model.LiveSession;
import com.LearningApp.User.model.User;
import com.LearningApp.User.repository.LiveSessionRepository;
import com.LearningApp.User.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class LiveSessionService {
    
    private final LiveSessionRepository liveSessionRepository;
    private final UserRepository userRepository;
    
    public LiveSession createSession(String tutorId, LiveSessionRequest sessionRequest) {
        User tutor = userRepository.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Tutor not found"));
        
        if (!"tutor".equals(tutor.getRole())) {
            throw new RuntimeException("User is not a tutor");
        }
        
        // Validate session times
        if (sessionRequest.getStartTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Start time cannot be in the past");
        }
        
        if (sessionRequest.getEndTime().isBefore(sessionRequest.getStartTime())) {
            throw new RuntimeException("End time must be after start time");
        }
        
        LiveSession session = LiveSession.builder()
                .tutorId(tutorId)
                .title(sessionRequest.getTitle())
                .startTime(sessionRequest.getStartTime())
                .endTime(sessionRequest.getEndTime())
                .timezone(sessionRequest.getTimezone())
                .capacity(sessionRequest.getCapacity())
                .bookedStudents(List.of())
                .createdAt(LocalDateTime.now())
                .build();
        
        return liveSessionRepository.save(session);
    }
    
    public List<LiveSession> getTutorSessions(String tutorId) {
        return liveSessionRepository.findByTutorId(tutorId);
    }
    
    public List<LiveSession> getUpcomingSessions() {
        return liveSessionRepository.findUpcomingSessions(LocalDateTime.now());
    }
    
    public List<LiveSession> getUpcomingSessionsByTutor(String tutorId) {
        return liveSessionRepository.findUpcomingSessionsByTutorId(tutorId, LocalDateTime.now());
    }
    
    public List<LiveSession> getStudentBookedSessions(String studentId) {
        return liveSessionRepository.findSessionsByBookedStudent(studentId);
    }
    
    public Optional<LiveSession> getSessionById(String sessionId) {
        return liveSessionRepository.findById(sessionId);
    }
    
    public LiveSession updateSession(String sessionId, String tutorId, LiveSessionRequest sessionRequest) {
        LiveSession session = liveSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        if (!session.getTutorId().equals(tutorId)) {
            throw new RuntimeException("You can only update your own sessions");
        }
        
        // Validate session times
        if (sessionRequest.getStartTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Start time cannot be in the past");
        }
        
        if (sessionRequest.getEndTime().isBefore(sessionRequest.getStartTime())) {
            throw new RuntimeException("End time must be after start time");
        }
        
        session.setTitle(sessionRequest.getTitle());
        session.setStartTime(sessionRequest.getStartTime());
        session.setEndTime(sessionRequest.getEndTime());
        session.setTimezone(sessionRequest.getTimezone());
        session.setCapacity(sessionRequest.getCapacity());
        
        return liveSessionRepository.save(session);
    }
    
    public void deleteSession(String sessionId, String tutorId) {
        LiveSession session = liveSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        if (!session.getTutorId().equals(tutorId)) {
            throw new RuntimeException("You can only delete your own sessions");
        }
        
        liveSessionRepository.deleteById(sessionId);
    }
    
    public LiveSession bookSession(String sessionId, String studentId) {
        LiveSession session = liveSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        // Check if session is in the future
        if (session.getStartTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Cannot book past sessions");
        }
        
        // Check if already booked
        if (session.getBookedStudents().contains(studentId)) {
            throw new RuntimeException("Already booked this session");
        }
        
        // Check capacity
        if (session.getBookedStudents().size() >= session.getCapacity()) {
            throw new RuntimeException("Session is full");
        }
        
        // Add student to booked list
        List<String> bookedStudents = session.getBookedStudents();
        bookedStudents.add(studentId);
        session.setBookedStudents(bookedStudents);
        
        return liveSessionRepository.save(session);
    }
    
    public LiveSession cancelBooking(String sessionId, String studentId) {
        LiveSession session = liveSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        List<String> bookedStudents = session.getBookedStudents();
        if (!bookedStudents.contains(studentId)) {
            throw new RuntimeException("Not booked for this session");
        }
        
        bookedStudents.remove(studentId);
        session.setBookedStudents(bookedStudents);
        
        return liveSessionRepository.save(session);
    }
}
