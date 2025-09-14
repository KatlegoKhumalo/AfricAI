package com.LearningApp.User.controller;

import com.LearningApp.User.DTO.CourseRequest;
import com.LearningApp.User.model.Course;
import com.LearningApp.User.security.JwtUtil;
import com.LearningApp.User.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class CourseController {
    
    private final CourseService courseService;
    private final JwtUtil jwtUtil;
    
    @GetMapping
    public ResponseEntity<?> getAllCourses(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Double minRating) {
        try {
            List<Course> courses;
            
            if (category != null && minPrice != null && maxPrice != null) {
                courses = courseService.getCoursesByCategoryAndPriceRange(category, minPrice, maxPrice);
            } else if (category != null) {
                courses = courseService.getCoursesByCategory(category);
            } else if (minRating != null) {
                courses = courseService.getCoursesByRating(minRating);
            } else {
                courses = courseService.getAllCourses();
            }
            
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            log.error("Get courses error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/{courseId}")
    public ResponseEntity<?> getCourseById(@PathVariable String courseId) {
        try {
            Course course = courseService.getCourseById(courseId)
                    .orElseThrow(() -> new RuntimeException("Course not found"));
            
            Map<String, Object> response = new HashMap<>();
            response.put("course", course);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Get course error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createCourse(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody CourseRequest courseRequest) {
        try {
            String jwt = token.substring(7);
            String userId = jwtUtil.getUserIdFromToken(jwt);
            String role = jwtUtil.getRoleFromToken(jwt);
            
            if (!"tutor".equals(role) && !"admin".equals(role)) {
                return ResponseEntity.status(403).body(createErrorResponse("Access denied"));
            }
            
            Course course = courseService.createCourse(userId, courseRequest);
            
            Map<String, Object> response = new HashMap<>();
            response.put("course", course);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Create course error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{courseId}")
    public ResponseEntity<?> updateCourse(
            @RequestHeader("Authorization") String token,
            @PathVariable String courseId,
            @Valid @RequestBody CourseRequest courseRequest) {
        try {
            String jwt = token.substring(7);
            String userId = jwtUtil.getUserIdFromToken(jwt);
            String role = jwtUtil.getRoleFromToken(jwt);
            
            if (!"tutor".equals(role) && !"admin".equals(role)) {
                return ResponseEntity.status(403).body(createErrorResponse("Access denied"));
            }
            
            Course course = courseService.updateCourse(courseId, userId, courseRequest);
            
            Map<String, Object> response = new HashMap<>();
            response.put("course", course);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Update course error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{courseId}")
    public ResponseEntity<?> deleteCourse(
            @RequestHeader("Authorization") String token,
            @PathVariable String courseId) {
        try {
            String jwt = token.substring(7);
            String userId = jwtUtil.getUserIdFromToken(jwt);
            String role = jwtUtil.getRoleFromToken(jwt);
            
            if (!"tutor".equals(role) && !"admin".equals(role)) {
                return ResponseEntity.status(403).body(createErrorResponse("Access denied"));
            }
            
            courseService.deleteCourse(courseId, userId);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Course deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Delete course error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<?> searchCourses(@RequestParam String query) {
        try {
            List<Course> courses = courseService.searchCourses(query);
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            log.error("Search courses error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/tutor/{tutorId}")
    public ResponseEntity<?> getCoursesByTutor(@PathVariable String tutorId) {
        try {
            List<Course> courses = courseService.getCoursesByTutor(tutorId);
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            log.error("Get tutor courses error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}
