package com.project.app.repository;

import com.project.app.model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CourseRepository extends MongoRepository<Course, String> {
    List<Course> findByCategory(String category);
    List<Course> findByTutorId(String tutorId);
}
