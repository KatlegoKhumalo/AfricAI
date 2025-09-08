package com.LearningApp.User.DTO;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AdminRegister {
    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 50, message = "Full name must be between 2 and 50 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 50, message = "Email must not exceed 50 characters")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 20, message = "Password must be between 8 and 20 characters")
    @Pattern(
            regexp = ".*[!@#$%^&*(),.?\":{}|<>].*",
            message = "Password must contain at least one special character"
    )
    private String password;

    @NotBlank(message = "Role is required")
    @Pattern(regexp = "^(ADMIN|SUPER_ADMIN)$", message = "Role must be either ADMIN or SUPER_ADMIN")
    private String role;

    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "\\d{10}", message = "Contact number must be 10 digits")
    private String contactNumber;
}
