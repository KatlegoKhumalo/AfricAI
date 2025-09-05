package com.LearningApp.User.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;


@Entity
@RequiredArgsConstructor
@Data
@Table(name = "User_Table")
public class User {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int Id;
    @Getter
    @Setter
    @NotBlank(message = "Id field cannot be blank")
    @Size(min = 13,max = 13 , message = "Enter valid Id number")
    @Pattern(regexp = "\\d{13}", message = "Id number must contain only digits")
    @Column(unique = true)
    private int IdNumber;
    @Getter
    @Setter
    @NotNull(message = "Full Name Field cannot be blank")
    @Size(min = 2 , max = 50 , message = "Enter a Valid Name ")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Full name can only contain letters and spaces")
    public String FullName;
    @Getter
    @Setter
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 50, message = "Email must not exceed 50 characters")

    public String Email;
    @Getter
    @Setter
    public String Course;
    @Getter
    @Setter
    @NotBlank(message = "Enter password")
    @Size(min = 8, max = 8, message = "Your password must be 8 characters")
    @Pattern(regexp = "r'[!@#$%^&*(),.?\":{}|<>]'", message = "Password must contain a special character")
    private String Password;
    @Setter
    @Getter
    private String TutorId;

}
