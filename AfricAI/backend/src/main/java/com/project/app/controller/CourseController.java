package com.project.app.controller;

import com.project.app.dto.CourseDto;
import com.project.app.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    @GetMapping("/my-courses")
    public ResponseEntity<List<CourseDto>> getMyCourses(Authentication auth) {
        String tutorId = auth.getName(); // Assuming the user's name/principal is the tutorId
        return ResponseEntity.ok(courseService.getCoursesByTutor(tutorId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDto> getCourseById(@PathVariable String id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    // TODO: Add validation to CourseDto
    @PostMapping(consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public CourseDto createCourse(@RequestPart("course") @Valid CourseDto courseDto, @RequestPart("file") MultipartFile file) throws IOException {
        return courseService.createCourse(courseDto, file);
    }

    // Fallback: accept JSON-only (data URL image or no image). Useful for dev when multipart fails.
    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<CourseDto> createCourseJson(@Valid @RequestBody CourseDto courseDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(courseService.createCourseNoFile(courseDto));
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
