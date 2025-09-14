package com.LearningApp.User.service;

import com.LearningApp.User.DTO.SubscriptionRequest;
import com.LearningApp.User.model.Transaction;
import com.LearningApp.User.model.User;
import com.LearningApp.User.repository.TransactionRepository;
import com.LearningApp.User.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {
    
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    
    public List<Transaction> getUserTransactions(String userId) {
        return transactionRepository.findByUserId(userId);
    }
    
    public List<Transaction> getTransactionsByType(String type) {
        return transactionRepository.findByType(type);
    }
    
    public List<Transaction> getUserTransactionsByType(String userId, String type) {
        return transactionRepository.findByUserIdAndType(userId, type);
    }
    
    public List<Transaction> getTransactionsBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        return transactionRepository.findTransactionsBetweenDates(startDate, endDate);
    }
    
    public List<Transaction> getAllCourseSales() {
        return transactionRepository.findAllCourseSales();
    }
    
    public List<Transaction> getAllTutorSubscriptions() {
        return transactionRepository.findAllTutorSubscriptions();
    }
    
    public Transaction createTutorSubscription(String tutorId, SubscriptionRequest subscriptionRequest) {
        User tutor = userRepository.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Tutor not found"));
        
        if (!"tutor".equals(tutor.getRole())) {
            throw new RuntimeException("User is not a tutor");
        }
        
        // Activate tutor subscription
        userService.activateTutorSubscription(tutorId);
        
        // Create transaction record
        Transaction transaction = Transaction.builder()
                .userId(tutorId)
                .type("Tutor Subscription")
                .amount(350.0) // Fixed subscription fee
                .description("Monthly Tutor Fee")
                .date(LocalDateTime.now())
                .build();
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        
        // Update user's payment method if provided
        if (subscriptionRequest.getPaymentData() != null) {
            userService.updatePaymentMethod(tutorId, subscriptionRequest.getPaymentData());
        }
        
        return savedTransaction;
    }
    
    public Transaction createTransaction(String userId, String type, Double amount, String description, String relatedCourseId) {
        Transaction transaction = Transaction.builder()
                .userId(userId)
                .type(type)
                .amount(amount)
                .description(description)
                .relatedCourseId(relatedCourseId)
                .date(LocalDateTime.now())
                .build();
        
        return transactionRepository.save(transaction);
    }
    
    public Double getTotalRevenue() {
        List<Transaction> allTransactions = transactionRepository.findAll();
        return allTransactions.stream()
                .mapToDouble(Transaction::getAmount)
                .sum();
    }
    
    public Double getTotalCourseSales() {
        List<Transaction> courseSales = getAllCourseSales();
        return courseSales.stream()
                .mapToDouble(Transaction::getAmount)
                .sum();
    }
    
    public Double getTotalSubscriptionRevenue() {
        List<Transaction> subscriptions = getAllTutorSubscriptions();
        return subscriptions.stream()
                .mapToDouble(Transaction::getAmount)
                .sum();
    }
    
    public Double getUserTotalSpent(String userId) {
        List<Transaction> userTransactions = getUserTransactions(userId);
        return userTransactions.stream()
                .mapToDouble(Transaction::getAmount)
                .sum();
    }
}
