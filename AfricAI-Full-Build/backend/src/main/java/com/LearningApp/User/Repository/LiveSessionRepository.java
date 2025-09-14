package com.LearningApp.User.repository;

import com.LearningApp.User.model.LiveSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LiveSessionRepository extends MongoRepository<LiveSession, String> {
    
    List<LiveSession> findByTutorId(String tutorId);
    
    @Query("{'startTime': {$gte: ?0}}")
    List<LiveSession> findUpcomingSessions(LocalDateTime now);
    
    @Query("{'tutorId': ?0, 'startTime': {$gte: ?1}}")
    List<LiveSession> findUpcomingSessionsByTutorId(String tutorId, LocalDateTime now);
    
    @Query("{'bookedStudents': ?0}")
    List<LiveSession> findSessionsByBookedStudent(String studentId);
    
    @Query("{'startTime': {$gte: ?0}, 'startTime': {$lte: ?1}}")
    List<LiveSession> findSessionsBetweenDates(LocalDateTime startDate, LocalDateTime endDate);
}
