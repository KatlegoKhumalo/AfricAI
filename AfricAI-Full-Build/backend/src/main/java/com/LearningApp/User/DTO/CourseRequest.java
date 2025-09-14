package com.LearningApp.User.DTO;

import com.LearningApp.User.model.Course;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class CourseRequest {
    
    @NotBlank(message = "Title is required")
    @Size(min = 2, max = 100, message = "Title must be between 2 and 100 characters")
    private String title;
    
    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
    private String description;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    @NotBlank(message = "Image URL is required")
    private String imageUrl;
    
    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price cannot be negative")
    private Double price;
    
    private List<Course.Chapter> chapters;
}
