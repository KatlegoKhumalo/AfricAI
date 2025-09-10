package com.LearningApp.User.service;

import com.LearningApp.User.DTO.TutorLogin;
import com.LearningApp.User.DTO.TutorRegister;
import com.LearningApp.User.DTO.courseDTO;
import com.LearningApp.User.Repository.UserRepo;
import com.LearningApp.User.Repository.courseRepo;
import com.LearningApp.User.model.User;
import com.LearningApp.User.model.course;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Objects;
import java.util.Optional;

@Service
@Transactional
public class courseService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private courseRepo CourseRepo;

//    public course createCourse(courseDTO CourseDTO, int currentUserId){
//       try{ Optional<User> userOptional = userRepo.findById(Long.valueOf(currentUserId));
//        if (userOptional.isEmpty()) {
//            throw new RuntimeException("User not found with id: " + currentUserId);
//        }
//        User currentUser = userOptional.get();
//        course Course = new course();
//        Course.setCourseName(CourseDTO.getCourseName());
//        Course.setCourseCode(CourseDTO.getCourseCode());
//        Course.setCourseClassification(CourseDTO.getCourseClassification());
//        Course.setCourseDuration(CourseDTO.getCourseDuration());
//        Course.setCoursePrice(CourseDTO.getCoursePrice());
//
//        // Set tutor information from current user
//        Course.setTutorUserId(Integer.parseInt(currentUser.getTutorId()));
//
//
//        return CourseRepo.save(Course);} catch (Exception e) {
//           throw new RuntimeException(e);
//       }
//    }

//    public void deleteCourse(Long courseId, Long currentUserId) {
//        course Course = CourseRepo.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));
//
//        // Check ownership
//        if (!Objects.equals(Course.getTutorUserId(), currentUserId)) {
//            throw new SecurityException("You can only delete your own courses");
//        }
//
//        CourseRepo.delete(Course);
//    }
    public course createCourse(TutorRegister tutorRegister,courseDTO CourseDTO){
        User user = userRepo.findBytutorId(tutorRegister.getTutorId()).orElseThrow(()->new RuntimeException("Tutor not found"));
        course Course = new course();
        Course.setCourseName(CourseDTO.getCourseName());
        Course.setCourseCode(CourseDTO.getCourseCode());
        Course.setCourseClassification(CourseDTO.getCourseClassification());
        Course.setCourseDuration(CourseDTO.getCourseDuration());
        Course.setCoursePrice(CourseDTO.getCoursePrice());
        Course.setCourseId(generateCourseId());

        return CourseRepo.save(Course);


    }
    public void deleteCourse(String tutorId, String CourseId){
        course Course = CourseRepo.findById(CourseId).orElseThrow(()->new RuntimeException("Course not found"));
        User user = new User();
        if(!user.getTutorId().equals(tutorId)){
            throw new RuntimeException("You are not allowed to delete a course that does not belong to you");
        }
    }
    private String generateCourseId() {
        ArrayList<String> numbers = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            numbers.add(String.valueOf(i));
        }
        Collections.shuffle(numbers);

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 8; i++) {
            sb.append(numbers.get(i));
        }
        return sb.toString();
    }
}
