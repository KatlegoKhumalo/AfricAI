package com.LearningApp.User.Repository;

import com.LearningApp.User.model.course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface courseRepo extends JpaRepository<course, String> {
   // Optional<course>findByCourseId();
}
