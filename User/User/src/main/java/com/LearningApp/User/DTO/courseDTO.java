package com.LearningApp.User.DTO;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;


@Data
public class courseDTO {
    @NotBlank(message = "Course name is mandatory")
    private String courseName;

    @NotBlank(message = "Course code is mandatory")
    private String courseCode;
    @NotBlank(message = "Course Classification is mandatory")
    private String courseClassification;
    @Positive(message = "Course duration must be positive")
    @NotNull(message = "Course Duration is mandatory")
    private int courseDuration;
    @Positive(message = "Course duration must be positive")
    private double coursePrice;
    private String CourseId;

}
