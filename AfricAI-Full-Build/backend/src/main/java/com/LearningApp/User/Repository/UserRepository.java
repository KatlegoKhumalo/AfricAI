package com.LearningApp.User.repository;

import com.LearningApp.User.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByPublicId(String publicId);
    
    List<User> findByRole(String role);
    
    @Query("{'role': 'tutor', 'tutorProfile.subscription.status': 'active'}")
    List<User> findActiveTutors();
    
    @Query("{'role': 'tutor', 'verified': true}")
    List<User> findVerifiedTutors();
    
    boolean existsByEmail(String email);
    
    boolean existsByPublicId(String publicId);
}
