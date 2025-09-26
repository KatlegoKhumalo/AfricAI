package com.project.app.service;

import com.project.app.dto.CourseDto;
import com.project.app.dto.TutorDto;
import com.project.app.mapper.CourseMapper;
import com.project.app.mapper.ChapterMapper;
import com.project.app.mapper.TutorMapper;
import com.project.app.model.Course;
import com.project.app.model.Tutor;
import com.project.app.model.User;
import com.project.app.repository.CourseRepository;
import com.project.app.repository.TutorRepository;
import com.project.app.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final TutorRepository tutorRepository;
    private final UserRepository userRepository;

    public CourseService(CourseRepository courseRepository, TutorRepository tutorRepository, UserRepository userRepository) {
        this.courseRepository = courseRepository;
        this.tutorRepository = tutorRepository;
        this.userRepository = userRepository;
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

    public List<CourseDto> getCoursesByTutor(String tutorId) {
        return courseRepository.findByTutorId(tutorId).stream()
                .map(this::mapCourseToDtoWithTutor)
                .collect(Collectors.toList());
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

    public CourseDto createCourse(CourseDto courseDto, MultipartFile file) throws IOException {
        // A real-world app would have more robust validation here.
        if (courseDto.getTutor() == null || courseDto.getTutor().getId() == null) {
            throw new IllegalArgumentException("A course must be assigned to a tutor.");
        }

        Tutor tutor = tutorRepository.findById(courseDto.getTutor().getId())
                .orElseGet(() -> autoProvisionTutor(courseDto.getTutor().getId()));

        Course course = new Course();
        // This would be a good place for a mapper, but doing it manually for clarity
        course.setTitle(courseDto.getTitle());
        course.setDescription(courseDto.getDescription());
        course.setCategory(courseDto.getCategory());
        course.setPrice(courseDto.getPrice());
        course.setDifficulty(courseDto.getDifficulty());
        course.setTutorId(tutor.getId());
        // Map chapters from DTO (optional)
        course.setChapters(ChapterMapper.fromChapterDtoList(courseDto.getChapters()));

        String dataUrl = "data:" + file.getContentType() + ";base64," + java.util.Base64.getEncoder().encodeToString(file.getBytes());
        course.setImageUrl(dataUrl);

        Course savedCourse = courseRepository.save(course);

        // Also update the tutor's list of courses
        if (tutor.getCourseIds() == null) {
            tutor.setCourseIds(new java.util.ArrayList<>());
        }
        tutor.getCourseIds().add(savedCourse.getId());
        tutorRepository.save(tutor);

        return mapCourseToDtoWithTutor(savedCourse);
    }

    public CourseDto createCourseNoFile(CourseDto courseDto) {
        if (courseDto.getTutor() == null || courseDto.getTutor().getId() == null) {
            throw new IllegalArgumentException("A course must be assigned to a tutor.");
        }

        Tutor tutor = tutorRepository.findById(courseDto.getTutor().getId())
                .orElseGet(() -> autoProvisionTutor(courseDto.getTutor().getId()));

        Course course = new Course();
        course.setTitle(courseDto.getTitle());
        course.setDescription(courseDto.getDescription());
        course.setCategory(courseDto.getCategory());
        course.setPrice(courseDto.getPrice());
        course.setDifficulty(courseDto.getDifficulty());
        course.setTutorId(tutor.getId());
        course.setChapters(ChapterMapper.fromChapterDtoList(courseDto.getChapters()));

        // Use provided imageUrl (data URL) or a placeholder
        course.setImageUrl(courseDto.getImageUrl() != null && !courseDto.getImageUrl().isBlank()
                ? courseDto.getImageUrl()
                : "/assets/images/default-avatar.svg");

        Course savedCourse = courseRepository.save(course);
        if (tutor.getCourseIds() == null) {
            tutor.setCourseIds(new java.util.ArrayList<>());
        }
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
        // Handle chapter updates
        course.setChapters(ChapterMapper.fromChapterDtoList(courseDto.getChapters()));

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

    private Tutor autoProvisionTutor(String tutorId) {
        // Try find user record first
        User user = userRepository.findById(tutorId).orElse(null);
        Tutor tutor = new Tutor();
        tutor.setId(tutorId);
        tutor.setPublicId(user != null ? user.getPublicId() : tutorId);
        tutor.setName(user != null ? user.getName() : "Unknown Tutor");
        tutor.setAvatarUrl(user != null ? user.getAvatarUrl() : "/assets/images/default-avatar.svg");
        tutor.setTitle(user != null ? user.getTitle() : "Tutor");
        tutor.setBio(user != null ? user.getBio() : "");
        tutor.setRating(0.0);
        tutor.setReviews(0);
        tutor.setVerified(false);
        tutor.setJoinDate(user != null ? user.getJoinDate() : new java.util.Date());
        tutor.setCourseIds(new java.util.ArrayList<>());
        return tutorRepository.save(tutor);
    }
}
