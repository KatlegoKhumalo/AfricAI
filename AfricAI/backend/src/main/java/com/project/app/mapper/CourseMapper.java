package com.project.app.mapper;

import com.project.app.dto.CourseDto;
import com.project.app.model.Course;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class CourseMapper {

    public static CourseDto toCourseDto(Course course) {
        if (course == null) {
            return null;
        }

        CourseDto dto = new CourseDto();
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setCategory(course.getCategory());
        dto.setImageUrl(course.getImageUrl());
        dto.setChapters(ChapterMapper.toChapterDtoList(course.getChapters()));
        dto.setPrice(course.getPrice());
        dto.setRating(course.getRating());
        dto.setReviews(course.getReviews());
        dto.setDifficulty(course.getDifficulty());
        // Note: The 'tutor' field is intentionally left null.
        // The service layer is responsible for populating this.

        return dto;
    }

    public static List<CourseDto> toCourseDtoList(List<Course> courses) {
        if (courses == null || courses.isEmpty()) {
            return Collections.emptyList();
        }

        return courses.stream()
                .map(CourseMapper::toCourseDto)
                .collect(Collectors.toList());
    }
}
