package com.LearningApp.User.model;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String DayOfTheWeek;
    private String courseName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id",nullable = false)
    private course Course;

    public course getCourse() {
        return Course;
    }

    public void setCourse(course course) {
        Course = course;
    }
}
