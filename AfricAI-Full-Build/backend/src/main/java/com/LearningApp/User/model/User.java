package com.LearningApp.User.model;

import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String publicId; // 7-digit numeric string for Tutors
    
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Indexed(unique = true)
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password; // Will be hashed with BCrypt
    
    @NotBlank(message = "Role is required")
    @Pattern(regexp = "^(learner|tutor|admin)$", message = "Role must be learner, tutor, or admin")
    private String role;
    
    private String avatarUrl = "https://i.pravatar.cc/150?u=" + System.currentTimeMillis();
    
    private String bio;
    
    @Builder.Default
    private Boolean verified = false;
    
    @Builder.Default
    private LocalDateTime joinDate = LocalDateTime.now();
    
    private PaymentMethod paymentMethod;
    
    // Tutor-specific fields
    private TutorProfile tutorProfile;
    
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PaymentMethod {
        private String cardNumber; // Store masked: "************4242"
        private String expiryDate;
        private String nameOnCard;
        private String billingAddress;
        private String zipCode;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TutorProfile {
        private String title; // e.g., 'Principal AI Scientist'
        private Subscription subscription;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Subscription {
        @Builder.Default
        private String status = "inactive"; // active, inactive, past_due
        private LocalDateTime nextBillingDate;
        private String stripeCustomerId; // For future real payments
    }
}