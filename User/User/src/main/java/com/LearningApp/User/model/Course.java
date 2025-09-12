package com.LearningApp.User.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@Table(name = "Courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int Id;

    @NotBlank(message = "Course code is mandatory")
    private String courseCode;
    @NotBlank(message = "Course Classification is mandatory")
    private String courseClassification;
    //@NotNull(message = "Course name Field cannot be blank")
    @Size(min = 2 , max = 50 , message = "Enter a Valid Course Name ")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Course name can only contain letters and spaces")
    private String courseName;
    @NotNull(message = "Course Duration is Mandatory")
    private int courseDuration;
    private double coursePrice;
    private int courseId;
//    private String tutorId;


//    @Column(name = "tutor_user_id", nullable = false)
//    private int tutorUserId;

    @OneToMany(mappedBy = "course",cascade = CascadeType.ALL,orphanRemoval = true)
    @ToString.Exclude
    private List<Schedule> schedules;


    @ManyToOne
    @JoinColumn(name = "tutorId",nullable = false)
    private User user;
}
