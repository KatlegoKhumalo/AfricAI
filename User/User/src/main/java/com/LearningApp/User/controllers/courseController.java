package com.LearningApp.User.controllers;

import com.LearningApp.User.DTO.courseDTO;
import com.LearningApp.User.model.course;
import com.LearningApp.User.service.courseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/course")
public class courseController {
    private final courseService CourseService;

    public courseController(courseService courseService) {
        CourseService = courseService;
    }
    @PostMapping("/Addcourse")
    public ResponseEntity<String>addcourse(@Valid @RequestBody courseDTO CourseDTO){
        course u = CourseService.createCourse(CourseDTO);
        return ResponseEntity.ok("Course Created ");
    }
}
