package com.LearningApp.User.DTO;


import lombok.Data;

import java.time.LocalDateTime;
@Data
public class ScheduleDTO {
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String DayOfTheWeek;
}
