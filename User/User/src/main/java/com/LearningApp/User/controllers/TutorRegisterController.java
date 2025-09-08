package com.LearningApp.User.controllers;

import com.LearningApp.User.DTO.TutorLogin;
import com.LearningApp.User.DTO.TutorRegister;
import com.LearningApp.User.model.User;
import com.LearningApp.User.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/TutorRegistration")
public class TutorRegisterController {
    private final UserService userService;

    public TutorRegisterController(UserService userService) {
        this.userService = userService;
    }
    @PostMapping("/Registration")
    public ResponseEntity<String>addTutor(@Valid @RequestBody TutorRegister tutorRegister){
        User u = userService.createTutor(tutorRegister);
        return ResponseEntity.ok("Tutor Registered "+u.getTutorId());
    }
}
