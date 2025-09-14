package com.LearningApp.User.model;

import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {
    
    @Id
    private String id;
    
    @NotBlank(message = "User ID is required")
    private String userId; // Reference to User ID
    
    @NotBlank(message = "Transaction type is required")
    @Pattern(regexp = "^(Course Sale|Tutor Subscription)$", message = "Type must be 'Course Sale' or 'Tutor Subscription'")
    private String type;
    
    @NotNull(message = "Amount is required")
    @Min(value = 0, message = "Amount cannot be negative")
    private Double amount;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    private String relatedCourseId; // Optional, for course sales
    
    @Builder.Default
    private LocalDateTime date = LocalDateTime.now();
}
