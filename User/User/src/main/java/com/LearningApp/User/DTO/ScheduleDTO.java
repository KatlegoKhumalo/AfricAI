package com.LearningApp.User.DTO;

import jakarta.persistence.Entity;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Data
public class ScheduleDTO {

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String DayOfTheWeek;
}
