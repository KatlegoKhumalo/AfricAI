package com.LearningApp.User.DTO;

import com.LearningApp.User.model.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Data
public class TutorLogin {
    private User user;

    @Size(min = 7, max = 7 , message = ("Enter valid Tutor Id"))
    @NotBlank(message = "Id field cannot be blank")
    @Pattern(regexp = "\\d{7}", message = "Id number must contain only digits")
    private int tutorId;

    @NotBlank(message = "Enter password")
    @Size(min = 8, max = 8, message = "Your password must be 8 characters")
    @Pattern(regexp = ".*[!@#$%^&*(),.?\":{}|<>].*", message = "Password must contain a special character")
    private String Password;
}
