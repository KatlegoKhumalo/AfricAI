package com.LearningApp.User.DTO;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Entity
@Data
public class courseDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int Id;
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
