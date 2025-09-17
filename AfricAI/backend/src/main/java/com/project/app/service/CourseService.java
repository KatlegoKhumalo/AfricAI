package com.project.app.service;

import com.project.app.dto.CourseDto;
import com.project.app.dto.TutorDto;
import com.project.app.mapper.CourseMapper;
import com.project.app.mapper.TutorMapper;
import com.project.app.model.Course;
import com.project.app.model.Tutor;
import com.project.app.repository.CourseRepository;
import com.project.app.repository.TutorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final TutorRepository tutorRepository;

    public CourseService(CourseRepository courseRepository, TutorRepository tutorRepository) {
        this.courseRepository = courseRepository;
        this.tutorRepository = tutorRepository;
    }

    public List<CourseDto> getAllCourses(String category) {
        List<Course> courses;
        if (category != null && !category.isBlank()) {
            courses = courseRepository.findByCategory(category);
        } else {
            courses = courseRepository.findAll();
        }
        return courses.stream()
                .map(this::mapCourseToDtoWithTutor)
                .collect(Collectors.toList());
    }

    public CourseDto getCourseById(String id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id)); // TODO: Use custom exception
        return mapCourseToDtoWithTutor(course);
    }

    private CourseDto mapCourseToDtoWithTutor(Course course) {
        CourseDto courseDto = CourseMapper.toCourseDto(course);
        if (course.getTutorId() != null) {
            tutorRepository.findById(course.getTutorId()).ifPresent(tutor -> {
                TutorDto tutorDto = TutorMapper.toTutorDto(tutor);
                courseDto.setTutor(tutorDto);
            });
        }
        return courseDto;
    }

    public CourseDto createCourse(CourseDto courseDto) {
        // A real-world app would have more robust validation here.
        if (courseDto.getTutor() == null || courseDto.getTutor().getId() == null) {
            throw new IllegalArgumentException("A course must be assigned to a tutor.");
        }

        Tutor tutor = tutorRepository.findById(courseDto.getTutor().getId())
                .orElseThrow(() -> new RuntimeException("Tutor not found with id: " + courseDto.getTutor().getId()));

        Course course = new Course();
        // This would be a good place for a mapper, but doing it manually for clarity
        course.setTitle(courseDto.getTitle());
        course.setDescription(courseDto.getDescription());
        course.setCategory(courseDto.getCategory());
        course.setImageUrl(courseDto.getImageUrl());
        course.setPrice(courseDto.getPrice());
        course.setDifficulty(courseDto.getDifficulty());
        course.setTutorId(tutor.getId());
        // TODO: Map chapters from DTO
        // course.setChapters(...)

        Course savedCourse = courseRepository.save(course);

        // Also update the tutor's list of courses
        tutor.getCourseIds().add(savedCourse.getId());
        tutorRepository.save(tutor);

        return mapCourseToDtoWithTutor(savedCourse);
    }

    public CourseDto updateCourse(String id, CourseDto courseDto) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));

        // Update mutable fields
        course.setTitle(courseDto.getTitle());
        course.setDescription(courseDto.getDescription());
        course.setCategory(courseDto.getCategory());
        course.setImageUrl(courseDto.getImageUrl());
        course.setPrice(courseDto.getPrice());
        course.setDifficulty(courseDto.getDifficulty());
        // TODO: Handle chapter updates

        Course updatedCourse = courseRepository.save(course);
        return mapCourseToDtoWithTutor(updatedCourse);
    }

    public void deleteCourse(String id) {
        if (!courseRepository.existsById(id)) {
            // Or just return, for idempotency
            throw new RuntimeException("Course not found with id: " + id);
        }

        // Clean up tutor's reference to this course
        courseRepository.findById(id).ifPresent(course -> {
            if (course.getTutorId() != null) {
                tutorRepository.findById(course.getTutorId()).ifPresent(tutor -> {
                    tutor.getCourseIds().remove(id);
                    tutorRepository.save(tutor);
                });
            }
        });

        courseRepository.deleteById(id);
    }
}
