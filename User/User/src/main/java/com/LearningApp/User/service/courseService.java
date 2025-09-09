package com.LearningApp.User.service;

import com.LearningApp.User.DTO.courseDTO;
import com.LearningApp.User.Repository.UserRepo;
import com.LearningApp.User.Repository.courseRepo;
import com.LearningApp.User.model.User;
import com.LearningApp.User.model.course;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Service
@Transactional
public class courseService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private courseRepo CourseRepo;

    public course createCourse(courseDTO CourseDTO, int currentUserId){
       try{ Optional<User> userOptional = userRepo.findById(Long.valueOf(currentUserId));
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found with id: " + currentUserId);
        }
        User currentUser = userOptional.get();
        course Course = new course();
        Course.setCourseName(CourseDTO.getCourseName());
        Course.setCourseCode(CourseDTO.getCourseCode());
        Course.setCourseClassification(CourseDTO.getCourseClassification());
        Course.setCourseDuration(CourseDTO.getCourseDuration());
        Course.setCoursePrice(CourseDTO.getCoursePrice());

        // Set tutor information from current user
        Course.setTutorUserId(Integer.parseInt(currentUser.getTutorId()));


        return CourseRepo.save(Course);} catch (Exception e) {
           throw new RuntimeException(e);
       }
    }

    public void deleteCourse(Long courseId, Long currentUserId) {
        course Course = CourseRepo.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));

        // Check ownership
        if (!Objects.equals(Course.getTutorUserId(), currentUserId)) {
            throw new SecurityException("You can only delete your own courses");
        }

        CourseRepo.delete(Course);
    }
}
