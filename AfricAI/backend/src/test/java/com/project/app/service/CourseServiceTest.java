package com.project.app.service;

import com.project.app.dto.CourseDto;
import com.project.app.dto.TutorDto;
import com.project.app.model.Course;
import com.project.app.model.Tutor;
import com.project.app.repository.CourseRepository;
import com.project.app.repository.TutorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;
    @Mock
    private TutorRepository tutorRepository;

    @InjectMocks
    private CourseService courseService;

    private Course course;
    private Tutor tutor;
    private CourseDto courseDto;

    @BeforeEach
    void setUp() {
        tutor = new Tutor();
        tutor.setId("tutor1");
        tutor.setName("Test Tutor");
        tutor.setCourseIds(new ArrayList<>());

        course = new Course();
        course.setId("course1");
        course.setTitle("Test Course");
        course.setTutorId("tutor1");

        courseDto = new CourseDto();
        courseDto.setTitle("New Course");
        TutorDto tutorDto = new TutorDto();
        tutorDto.setId("tutor1");
        courseDto.setTutor(tutorDto);
    }

    @Test
    void getAllCourses_ReturnsCourseList() {
        when(courseRepository.findAll()).thenReturn(Collections.singletonList(course));
        when(tutorRepository.findById("tutor1")).thenReturn(Optional.of(tutor));

        List<CourseDto> result = courseService.getAllCourses(null);

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals("Test Course", result.get(0).getTitle());
        assertNotNull(result.get(0).getTutor());
        assertEquals("Test Tutor", result.get(0).getTutor().getName());
    }

    @Test
    void getCourseById_Success() {
        when(courseRepository.findById("course1")).thenReturn(Optional.of(course));
        when(tutorRepository.findById("tutor1")).thenReturn(Optional.of(tutor));

        CourseDto result = courseService.getCourseById("course1");

        assertNotNull(result);
        assertEquals("Test Course", result.getTitle());
    }

    @Test
    void getCourseById_NotFound_ThrowsException() {
        when(courseRepository.findById(anyString())).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> courseService.getCourseById("nonexistent"));
    }

    @Test
    void createCourse_Success() {
        when(tutorRepository.findById("tutor1")).thenReturn(Optional.of(tutor));
        when(courseRepository.save(any(Course.class))).thenAnswer(invocation -> {
            Course c = invocation.getArgument(0);
            c.setId("newCourse1");
            return c;
        });

        CourseDto result = courseService.createCourse(courseDto);

        assertNotNull(result);
        assertEquals("New Course", result.getTitle());
        verify(courseRepository, times(1)).save(any(Course.class));
        verify(tutorRepository, times(1)).save(any(Tutor.class));
        assertTrue(tutor.getCourseIds().contains("newCourse1"));
    }

    @Test
    void deleteCourse_Success() {
        when(courseRepository.existsById("course1")).thenReturn(true);
        when(courseRepository.findById("course1")).thenReturn(Optional.of(course));
        when(tutorRepository.findById("tutor1")).thenReturn(Optional.of(tutor));
        tutor.getCourseIds().add("course1");

        courseService.deleteCourse("course1");

        verify(courseRepository, times(1)).deleteById("course1");
        verify(tutorRepository, times(1)).save(tutor);
        assertFalse(tutor.getCourseIds().contains("course1"));
    }
}
