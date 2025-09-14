package com.LearningApp.User.model;

import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "liveSessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LiveSession {
    
    @Id
    private String id;
    
    @NotBlank(message = "Tutor ID is required")
    private String tutorId; // Reference to User ID
    
    @NotBlank(message = "Title is required")
    @Size(min = 2, max = 100, message = "Title must be between 2 and 100 characters")
    private String title;
    
    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;
    
    @NotNull(message = "End time is required")
    private LocalDateTime endTime;
    
    @NotBlank(message = "Timezone is required")
    private String timezone;
    
    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;
    
    @Builder.Default
    private List<String> bookedStudents = List.of(); // Array of learner IDs
    
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
