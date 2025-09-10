package com.LearningApp.User.DTO;

import com.LearningApp.User.model.User;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Data
public class TutorRegister {


    @NotBlank(message = "Full Name Field cannot be blank")
    @Size(min = 2 , max = 50 , message = "Enter a Valid Name ")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Full name can only contain letters and spaces")
    public String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 50, message = "Email must not exceed 50 characters")
    public String email;

    @NotBlank(message = "Enter password")
    @Size(min = 8, max = 8, message = "Your password must be 8 characters")
    @Pattern(regexp = ".*[!@#$%^&*(),.?\":{}|<>].*", message = "Password must contain a special character")
    private String password;

    private int Id;


    private String tutorId;
}
