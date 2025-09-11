package com.LearningApp.User.service;

import com.LearningApp.User.DTO.ScheduleDTO;
import com.LearningApp.User.Repository.ScheduleRepo;
import com.LearningApp.User.Repository.courseRepo;
import com.LearningApp.User.model.Schedule;
import com.LearningApp.User.model.course;
import org.springframework.stereotype.Service;

@Service
public class ScheduleService {
    private final ScheduleRepo scheduleRepo;
    private final courseRepo CourseRepo;

    public ScheduleService(ScheduleRepo scheduleRepo, courseRepo courseRepo) {
        this.scheduleRepo = scheduleRepo;
        CourseRepo = courseRepo;
    }
    public Schedule addSchedule(String CourseId, ScheduleDTO scheduleDTO){
        course Course = CourseRepo.findById(CourseId).orElseThrow(()->new RuntimeException("Course not found"));

        Schedule schedule=new Schedule();
        schedule.setStartTime(scheduleDTO.getStartTime());
        schedule.setEndTime(scheduleDTO.getEndTime());
        schedule.setDayOfTheWeek(scheduleDTO.getDayOfTheWeek());
        schedule.setCourseName(Course.getCourseName());
        schedule.setCourse(Course);
        return scheduleRepo.save(schedule);
    }
}
