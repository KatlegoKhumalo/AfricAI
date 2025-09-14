package com.LearningApp.User.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class AuthRequest {
    
    @NotBlank(message = "Identifier is required")
    private String identifier; // Email for learner/admin, publicId for tutor
    
    @NotBlank(message = "Password is required")
    private String password;
    
    @NotBlank(message = "Role is required")
    @Pattern(regexp = "^(learner|tutor|admin)$", message = "Role must be learner, tutor, or admin")
    private String role;
}
