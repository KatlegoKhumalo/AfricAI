package com.LearningApp.User.DTO;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class SignupRequest {
    
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
    
    @NotBlank(message = "Role is required")
    @Pattern(regexp = "^(learner|tutor)$", message = "Role must be learner or tutor")
    private String role;
}
