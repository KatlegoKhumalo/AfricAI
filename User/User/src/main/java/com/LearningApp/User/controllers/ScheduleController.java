package com.LearningApp.User.controllers;

import com.LearningApp.User.DTO.ScheduleDTO;
import com.LearningApp.User.model.Schedule;
import com.LearningApp.User.service.ScheduleService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/Schedule/{CourseId}")
public class ScheduleController {
    public final ScheduleService scheduleService;

    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }
    @PostMapping
    public ResponseEntity<String>addSchedule(@Valid @RequestBody ScheduleDTO scheduleDTO,
                                                @PathVariable int CourseId) {
        Schedule schedule = scheduleService.addSchedule(CourseId,scheduleDTO);
        return ResponseEntity.ok("Schedule Added" + schedule);
    }
}
