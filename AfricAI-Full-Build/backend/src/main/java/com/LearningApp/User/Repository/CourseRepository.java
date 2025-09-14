package com.LearningApp.User.repository;

import com.LearningApp.User.model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends MongoRepository<Course, String> {
    
    List<Course> findByTutorId(String tutorId);
    
    List<Course> findByCategory(String category);
    
    @Query("{'title': {$regex: ?0, $options: 'i'}}")
    List<Course> findByTitleContainingIgnoreCase(String title);
    
    @Query("{'category': ?0, 'price': {$gte: ?1, $lte: ?2}}")
    List<Course> findByCategoryAndPriceBetween(String category, Double minPrice, Double maxPrice);
    
    @Query("{'rating': {$gte: ?0}}")
    List<Course> findByRatingGreaterThanEqual(Double rating);
    
    @Query("{'tutorId': ?0, 'category': ?1}")
    List<Course> findByTutorIdAndCategory(String tutorId, String category);
}
