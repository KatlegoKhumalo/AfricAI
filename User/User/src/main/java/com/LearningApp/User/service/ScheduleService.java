package com.LearningApp.User.service;

import com.LearningApp.User.DTO.ScheduleDTO;
import com.LearningApp.User.Repository.ScheduleRepo;
import com.LearningApp.User.model.Schedule;
import org.springframework.stereotype.Service;

@Service
public class ScheduleService {

    private final ScheduleRepo scheduleRepo;

    public ScheduleService(ScheduleRepo scheduleRepo) {
        this.scheduleRepo = scheduleRepo;
    }

    public Schedule createSchedule(ScheduleDTO scheduleDTO){
        Schedule schedule = new Schedule();
        schedule.setDayOfTheWeek(scheduleDTO.getDayOfTheWeek());
        schedule.setStartTime(scheduleDTO.getStartTime());
        schedule.setEndTime(scheduleDTO.getEndTime());
        return scheduleRepo.save(schedule);
    }
}
