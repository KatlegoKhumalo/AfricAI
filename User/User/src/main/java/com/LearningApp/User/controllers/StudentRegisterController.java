package com.LearningApp.User.controllers;

import com.LearningApp.User.DTO.StudentRegister;
import com.LearningApp.User.model.User;
import com.LearningApp.User.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/StudentRegister")
public class StudentRegisterController {
    private final UserService userService;

    public StudentRegisterController(UserService userService) {
        this.userService = userService;
    }
    @PostMapping("/Register")
    public ResponseEntity<String>addStudent(@Valid @RequestBody StudentRegister studentRegister){
        User user = userService.createUser(studentRegister);
        return ResponseEntity.ok("Successfully Registered "+user.getFullName());

    }
}
