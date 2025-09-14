package com.LearningApp.User.model;

import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.CompoundIndex;

import java.time.LocalDateTime;

@Document(collection = "enrollments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@CompoundIndex(def = "{'learnerId': 1, 'courseId': 1}", unique = true)
public class Enrollment {
    
    @Id
    private String id;
    
    @NotBlank(message = "Learner ID is required")
    private String learnerId; // Reference to User ID
    
    @NotBlank(message = "Course ID is required")
    private String courseId; // Reference to Course ID
    
    @Builder.Default
    @Min(value = 0, message = "Progress cannot be negative")
    @Max(value = 100, message = "Progress cannot exceed 100")
    private Integer progress = 0; // Percentage
    
    @Builder.Default
    private LocalDateTime enrolledAt = LocalDateTime.now();
}
