package com.project.app.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.app.dto.CourseDto;
import com.project.app.dto.SignUpRequest;
import com.project.app.dto.TutorDto;
import com.project.app.model.UserRole;
import com.project.app.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
@Disabled("Disabling until a Docker environment is available for Testcontainers")
class CourseControllerIntegrationTest {

    @Container
    static MongoDBContainer mongoDBContainer = new MongoDBContainer("mongo:6.0");

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    private String jwtToken;
    private String tutorId;

    @BeforeEach
    void setUp() throws Exception {
        // Clean up before each test
        userRepository.deleteAll();

        // 1. Create a Tutor user to be the author of the course
        SignUpRequest signUpRequest = new SignUpRequest();
        signUpRequest.setName("Course Tutor");
        signUpRequest.setEmail("tutor.course@example.com");
        signUpRequest.setPassword("password123");
        signUpRequest.setRole(UserRole.TUTOR);

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signUpRequest)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode responseNode = objectMapper.readTree(result.getResponse().getContentAsString());
        jwtToken = responseNode.get("accessToken").asText();

        // 2. Get the created user's ID to use as the tutorId
        result = mockMvc.perform(get("/api/auth/me").header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andReturn();

        responseNode = objectMapper.readTree(result.getResponse().getContentAsString());
        tutorId = responseNode.get("id").asText();
    }

    @Test
    void courseCrudFlow_shouldSucceed() throws Exception {
        // 1. CREATE Course
        TutorDto tutorDto = new TutorDto();
        tutorDto.setId(tutorId);

        CourseDto courseDto = new CourseDto();
        courseDto.setTitle("Integration Test Course");
        courseDto.setCategory("Testing");
        courseDto.setTutor(tutorDto);

        MvcResult createResult = mockMvc.perform(post("/api/courses")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(courseDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.title").value("Integration Test Course"))
                .andReturn();

        String createdCourseId = objectMapper.readTree(createResult.getResponse().getContentAsString()).get("id").asText();

        // 2. READ Course
        mockMvc.perform(get("/api/courses/" + createdCourseId)
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(createdCourseId))
                .andExpect(jsonPath("$.tutor.id").value(tutorId));

        // 3. UPDATE Course
        courseDto.setTitle("Updated Integration Test Course");
        mockMvc.perform(put("/api/courses/" + createdCourseId)
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(courseDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Integration Test Course"));

        // 4. DELETE Course
        mockMvc.perform(delete("/api/courses/" + createdCourseId)
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isNoContent());

        // 5. VERIFY Deletion
        mockMvc.perform(get("/api/courses/" + createdCourseId)
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isNotFound());
    }
}
