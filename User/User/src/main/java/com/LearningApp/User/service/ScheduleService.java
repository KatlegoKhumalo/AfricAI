package com.LearningApp.User.service;

import com.LearningApp.User.DTO.ScheduleDTO;
import com.LearningApp.User.Repository.ScheduleRepo;
import com.LearningApp.User.Repository.courseRepo;
import com.LearningApp.User.model.Schedule;
import com.LearningApp.User.model.course;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ScheduleService {

    private final ScheduleRepo scheduleRepo;
    private final courseRepo courseRepository;

    public ScheduleService(ScheduleRepo scheduleRepo, courseRepo courseRepository) {
        this.scheduleRepo = scheduleRepo;
        this.courseRepository = courseRepository;
    }

    public Schedule createSchedule(String CourseId,ScheduleDTO scheduleDTO){
        Optional<course> Course = courseRepository.findById(String.valueOf(Long.valueOf(CourseId).describeConstable().orElseThrow(()->new RuntimeException("Course not found"))));

        Schedule schedule = new Schedule();
        schedule.setDayOfTheWeek(scheduleDTO.getDayOfTheWeek());
        schedule.setStartTime(scheduleDTO.getStartTime());
        schedule.setEndTime(scheduleDTO.getEndTime());
        return scheduleRepo.save(schedule);
    }
}
