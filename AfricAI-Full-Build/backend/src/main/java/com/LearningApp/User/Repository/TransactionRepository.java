package com.LearningApp.User.repository;

import com.LearningApp.User.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {
    
    List<Transaction> findByUserId(String userId);
    
    List<Transaction> findByType(String type);
    
    @Query("{'userId': ?0, 'type': ?1}")
    List<Transaction> findByUserIdAndType(String userId, String type);
    
    @Query("{'date': {$gte: ?0}, 'date': {$lte: ?1}}")
    List<Transaction> findTransactionsBetweenDates(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{'type': 'Course Sale'}")
    List<Transaction> findAllCourseSales();
    
    @Query("{'type': 'Tutor Subscription'}")
    List<Transaction> findAllTutorSubscriptions();
}
