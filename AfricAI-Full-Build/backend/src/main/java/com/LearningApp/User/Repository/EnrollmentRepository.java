package com.LearningApp.User.repository;

import com.LearningApp.User.model.Enrollment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends MongoRepository<Enrollment, String> {
    
    List<Enrollment> findByLearnerId(String learnerId);
    
    List<Enrollment> findByCourseId(String courseId);
    
    Optional<Enrollment> findByLearnerIdAndCourseId(String learnerId, String courseId);
    
    boolean existsByLearnerIdAndCourseId(String learnerId, String courseId);
    
    @Query("{'learnerId': ?0, 'progress': {$gte: 100}}")
    List<Enrollment> findCompletedCoursesByLearnerId(String learnerId);
    
    @Query("{'learnerId': ?0, 'progress': {$lt: 100}}")
    List<Enrollment> findInProgressCoursesByLearnerId(String learnerId);
}
