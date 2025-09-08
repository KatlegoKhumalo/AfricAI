package com.LearningApp.User.controllers;
import com.LearningApp.User.DTO.AdminRegister;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    // GET endpoint just to check if admin API is alive
    @GetMapping("/test")
    public String testAdmin() {
        return "Admin API is running!";
    }

    // POST endpoint to register new admin
    @PostMapping("/register")
    public ResponseEntity<String> registerAdmin(@Valid @RequestBody AdminRegister dto) {
        return ResponseEntity.ok("Admin registered successfully: " + dto.getFullName() + " with role " + dto.getRole());
    }
    //http://localhost:8080/api/admin/test
}
