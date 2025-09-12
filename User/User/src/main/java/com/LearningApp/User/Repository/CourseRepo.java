package com.LearningApp.User.Repository;

import com.LearningApp.User.model.Course;
import com.LearningApp.User.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.Optional;

@Repository
public interface CourseRepo extends JpaRepository<Course,Integer> {
//    ScopedValue<Object> findById(int courseId);
    //Optional<String>findByCourseId(String CourseId);
}
