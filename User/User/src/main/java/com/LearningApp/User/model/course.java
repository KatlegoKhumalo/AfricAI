package com.LearningApp.User.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int courseId;

    @NotBlank(message = "Course code is mandatory")
    private String courseCode;
    private String courseClassification;
    @NotNull(message = "Course name Field cannot be blank")
    @Size(min = 2 , max = 50 , message = "Enter a Valid Course Name ")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Course name can only contain letters and spaces")
    private String courseName;
    private int courseDuration;
    private double coursePrice;

    @Column(name = "tutor_user_id", nullable = false)
    private int tutorUserId;
}
