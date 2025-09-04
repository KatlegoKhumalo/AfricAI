package com.LearningApp.User.DTO;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Entity
@Data
public class courseDTO {
    @NotBlank(message = "Course name is mandatory")
    private String courseName;

    @NotBlank(message = "Course code is mandatory")
    private String courseCode;
    private String courseClassification;
    @Positive(message = "Course duration must be positive")
    private int courseDuration;
    @Positive(message = "Course duration must be positive")
    private double coursePrice;
}
