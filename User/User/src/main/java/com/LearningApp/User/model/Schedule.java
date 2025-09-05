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

    @ManyToOne
    @JoinColumn(name = "courseId",nullable = false)
    private course course;
}
