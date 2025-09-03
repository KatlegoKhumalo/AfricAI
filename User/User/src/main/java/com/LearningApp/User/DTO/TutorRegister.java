package com.LearningApp.User.DTO;

import com.LearningApp.User.model.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Data
public class TutorRegister {
    private User user;

    @NotNull(message = "Full Name Field cannot be blank")
    @Size(min = 2 , max = 50 , message = "Enter a Valid Name ")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Full name can only contain letters and spaces")
    public String FullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 50, message = "Email must not exceed 50 characters")
    public String Email;

    @NotBlank(message = "Enter password")
    @Size(min = 8, max = 8, message = "Your password must be 8 characters")
    @Pattern(regexp = "r'[!@#$%^&*(),.?\":{}|<>]'", message = "Password must contain a special character")
    private String Password;

    private int Id;

    @Size(min = 7, max = 7 , message = ("Enter valid Tutor Id"))
    @NotBlank(message = "Id field cannot be blank")
    @Pattern(regexp = "\\d{7}", message = "Id number must contain only digits")
    private String TutorId;
}
