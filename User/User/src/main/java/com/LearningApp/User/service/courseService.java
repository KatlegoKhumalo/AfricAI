package com.LearningApp.User.service;

import com.LearningApp.User.DTO.courseDTO;
import com.LearningApp.User.Repository.CourseRepo;
import com.LearningApp.User.Repository.UserRepo;
import com.LearningApp.User.Repository.CourseRepo;
import com.LearningApp.User.model.Course;
import com.LearningApp.User.model.User;
import com.LearningApp.User.model.Course;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;

@Service
@Transactional
public class courseService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private CourseRepo courseRepo;

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
    public Course createCourse(courseDTO CourseDTO){
      try{  User user = userRepo.findBytutorId(CourseDTO.getTutorId()).orElseThrow(()->new RuntimeException("Tutor not found"));
        Course course = new Course();
        course.setCourseName(CourseDTO.getCourseName());
        course.setCourseCode(CourseDTO.getCourseCode());
        course.setCourseClassification(CourseDTO.getCourseClassification());
        course.setCourseDuration(CourseDTO.getCourseDuration());
        course.setCoursePrice(CourseDTO.getCoursePrice());
        //course.setCourseId(generateCourseId());

        course.setUser(user);

        return courseRepo.save(course);} catch (Exception e) {
          e.printStackTrace();
          throw new RuntimeException();
      }


    }
    public void deleteCourse(String tutorId, int CourseId){
       try{ Course course = courseRepo.findById((CourseId)).orElseThrow(()->new RuntimeException("Course not found"));
        User user = new User();
        courseDTO CourseDTO = new courseDTO();
        if(!CourseDTO.getTutorId().equals(tutorId)){
            throw new RuntimeException("You are not allowed to delete a course that does not belong to you");
        }} catch (Exception e) {
           e.printStackTrace();
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
