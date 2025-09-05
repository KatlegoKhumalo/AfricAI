package com.LearningApp.User.controllers;

import com.LearningApp.User.DTO.ScheduleDTO;
import com.LearningApp.User.model.Schedule;
import com.LearningApp.User.service.ScheduleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/courses/{courseId}/schedule")
public class ScheduleController {

    private final ScheduleService scheduleService;

    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }
    @PostMapping("/course/{courseId}")
    public ResponseEntity<Schedule>addSchedule(@PathVariable int courseId,
                                               @RequestBody ScheduleDTO scheduleDTO){
        Schedule existingSchedule = scheduleService.createSchedule(scheduleDTO);
        return ResponseEntity.ok(existingSchedule);
    }
}
