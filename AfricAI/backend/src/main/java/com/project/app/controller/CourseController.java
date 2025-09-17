package com.project.app.controller;

import com.project.app.dto.CourseDto;
import com.project.app.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity<List<CourseDto>> getAllCourses(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(courseService.getAllCourses(category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDto> getCourseById(@PathVariable String id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    // TODO: Add validation to CourseDto
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CourseDto createCourse(@Valid @RequestBody CourseDto courseDto) {
        return courseService.createCourse(courseDto);
    }

    @PutMapping("/{id}")
    public CourseDto updateCourse(@PathVariable String id, @Valid @RequestBody CourseDto courseDto) {
        return courseService.updateCourse(id, courseDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCourse(@PathVariable String id) {
        courseService.deleteCourse(id);
    }
}
