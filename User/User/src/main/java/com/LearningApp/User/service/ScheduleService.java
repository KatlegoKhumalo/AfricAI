package com.LearningApp.User.service;

import com.LearningApp.User.DTO.ScheduleDTO;
import com.LearningApp.User.Repository.CourseRepo;
import com.LearningApp.User.Repository.ScheduleRepo;
import com.LearningApp.User.Repository.CourseRepo;
import com.LearningApp.User.model.Course;
import com.LearningApp.User.model.Schedule;
import com.LearningApp.User.model.Course;
import org.springframework.stereotype.Service;


@Service
public class ScheduleService {
    private final ScheduleRepo scheduleRepo;
    private final CourseRepo CourseRepo;

    public ScheduleService(ScheduleRepo scheduleRepo, CourseRepo courseRepo) {
        this.scheduleRepo = scheduleRepo;
        CourseRepo = courseRepo;
    }
    public Schedule addSchedule(int CourseId, ScheduleDTO scheduleDTO){
        Course course = CourseRepo.findById(CourseId).orElseThrow();

        Schedule schedule=new Schedule();
        schedule.setStartTime(scheduleDTO.getStartTime());
        schedule.setEndTime(scheduleDTO.getEndTime());
        schedule.setDayOfTheWeek(scheduleDTO.getDayOfTheWeek());
//        schedule.setCourseName(course.getCourseName());
        schedule.setCourse(course);
        return scheduleRepo.save(schedule);
    }
}
