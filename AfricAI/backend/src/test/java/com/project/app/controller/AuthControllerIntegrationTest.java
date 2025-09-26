package com.project.app.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.app.dto.LoginRequest;
import com.project.app.dto.SignUpRequest;
import com.project.app.model.UserRole;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
@Disabled("Disabling until a Docker environment is available for Testcontainers")
class AuthControllerIntegrationTest {

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

    @Test
    void fullAuthenticationFlow_shouldSucceed() throws Exception {
        // 1. Register a new user
        SignUpRequest signUpRequest = new SignUpRequest();
        signUpRequest.setName("Integration Test User");
        signUpRequest.setEmail("integration.test@example.com");
        signUpRequest.setPassword("password123");
        signUpRequest.setRole(UserRole.LEARNER);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signUpRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists());

        // 2. Login with the new user's credentials
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setIdentifier("integration.test@example.com");
        loginRequest.setPassword("password123");

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andReturn();

        String responseBody = loginResult.getResponse().getContentAsString();
        String token = objectMapper.readTree(responseBody).get("accessToken").asText();

        // 3. Access a protected endpoint (/me) with the token
        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("integration.test@example.com"))
                .andExpect(jsonPath("$.name").value("Integration Test User"));
    }

    @Test
    void register_withInvalidData_shouldFail() throws Exception {
        SignUpRequest signUpRequest = new SignUpRequest();
        signUpRequest.setName("a"); // Too short
        signUpRequest.setEmail("not-an-email");
        signUpRequest.setPassword("short");
        signUpRequest.setRole(null);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signUpRequest)))
                .andExpect(status().isBadRequest());
    }
}
