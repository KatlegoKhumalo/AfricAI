package com.LearningApp.User.controllers;


import com.LearningApp.User.DTO.TutorRegister;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tutors")
public class TutorController {


    // Simple GET endpoint to check app is running in browser
    @GetMapping("/test")
    public String test() {
        return "App is running!";
    }

    //  POST endpoint to handle tutor registration (with validation)
    @PostMapping("/register")
    public ResponseEntity<String> registerTutor(@Valid @RequestBody TutorRegister dto) {
        return ResponseEntity.ok("Tutor registered successfully: " + dto.getFullName());
    }
}

// http://localhost:8080/api/tutors/register
// http://localhost:8080/api/tutors/test