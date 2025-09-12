package com.LearningApp.User.controllers;


import com.LearningApp.User.DTO.CreateCourseDTO;
import com.LearningApp.User.DTO.TutorRegister;
import com.LearningApp.User.DTO.courseDTO;
import com.LearningApp.User.model.Course;
import com.LearningApp.User.model.Course;
import com.LearningApp.User.service.courseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/course")
public class courseController {
    private final courseService CourseService;

    public courseController(courseService courseService) {
        CourseService = courseService;
    }
    @PostMapping("/AddCourse")
    public ResponseEntity<String>addCourse(@Valid @RequestBody courseDTO CourseDTO
                                           ){
        Course course = CourseService.createCourse(CourseDTO);
        return ResponseEntity.ok("Course Added");
    }
    @DeleteMapping("/{tutorId}/{CourseId}")
    public ResponseEntity<String>DeleteCourse(@Valid @PathVariable String tutorId,
                                              @PathVariable int CourseId){
        CourseService.deleteCourse(tutorId, CourseId);
        return ResponseEntity.ok("Course Deleted");
    }
}
