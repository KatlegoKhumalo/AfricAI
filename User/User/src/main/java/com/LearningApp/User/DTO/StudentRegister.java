package com.LearningApp.User.DTO;

import com.LearningApp.User.model.User;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Data
public class StudentRegister {
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

    @NotBlank(message = "Id field cannot be blank")
    @Size(min = 13,max = 13 , message = "Enter valid Id number")
    @Pattern(regexp = "\\d{13}", message = "Id number must contain only digits")
    @Column(unique = true)
    private int IdNumber;

    private int Id;
}
