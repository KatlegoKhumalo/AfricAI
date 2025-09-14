package com.LearningApp.User.service;

import com.LearningApp.User.DTO.CourseRequest;
import com.LearningApp.User.model.Course;
import com.LearningApp.User.model.User;
import com.LearningApp.User.repository.CourseRepository;
import com.LearningApp.User.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CourseService {
    
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    
    public Course createCourse(String tutorId, CourseRequest courseRequest) {
        User tutor = userRepository.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Tutor not found"));
        
        if (!"tutor".equals(tutor.getRole())) {
            throw new RuntimeException("User is not a tutor");
        }
        
        Course course = Course.builder()
                .title(courseRequest.getTitle())
                .description(courseRequest.getDescription())
                .category(courseRequest.getCategory())
                .imageUrl(courseRequest.getImageUrl())
                .price(courseRequest.getPrice())
                .tutorId(tutorId)
                .chapters(courseRequest.getChapters())
                .rating(0.0)
                .reviewsCount(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        return courseRepository.save(course);
    }
    
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
    
    public Optional<Course> getCourseById(String courseId) {
        return courseRepository.findById(courseId);
    }
    
    public List<Course> getCoursesByTutor(String tutorId) {
        return courseRepository.findByTutorId(tutorId);
    }
    
    public List<Course> getCoursesByCategory(String category) {
        return courseRepository.findByCategory(category);
    }
    
    public List<Course> searchCourses(String query) {
        return courseRepository.findByTitleContainingIgnoreCase(query);
    }
    
    public List<Course> getCoursesByCategoryAndPriceRange(String category, Double minPrice, Double maxPrice) {
        return courseRepository.findByCategoryAndPriceBetween(category, minPrice, maxPrice);
    }
    
    public List<Course> getCoursesByRating(Double minRating) {
        return courseRepository.findByRatingGreaterThanEqual(minRating);
    }
    
    public Course updateCourse(String courseId, String tutorId, CourseRequest courseRequest) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        if (!course.getTutorId().equals(tutorId)) {
            throw new RuntimeException("You can only update your own courses");
        }
        
        course.setTitle(courseRequest.getTitle());
        course.setDescription(courseRequest.getDescription());
        course.setCategory(courseRequest.getCategory());
        course.setImageUrl(courseRequest.getImageUrl());
        course.setPrice(courseRequest.getPrice());
        course.setChapters(courseRequest.getChapters());
        course.setUpdatedAt(LocalDateTime.now());
        
        return courseRepository.save(course);
    }
    
    public void deleteCourse(String courseId, String tutorId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        if (!course.getTutorId().equals(tutorId)) {
            throw new RuntimeException("You can only delete your own courses");
        }
        
        courseRepository.deleteById(courseId);
    }
    
    public Course updateCourseRating(String courseId, Double rating) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        // Simple average calculation - in production, you'd want more sophisticated rating logic
        double currentRating = course.getRating();
        int currentReviews = course.getReviewsCount();
        
        double newRating = ((currentRating * currentReviews) + rating) / (currentReviews + 1);
        
        course.setRating(newRating);
        course.setReviewsCount(currentReviews + 1);
        course.setUpdatedAt(LocalDateTime.now());
        
        return courseRepository.save(course);
    }
}