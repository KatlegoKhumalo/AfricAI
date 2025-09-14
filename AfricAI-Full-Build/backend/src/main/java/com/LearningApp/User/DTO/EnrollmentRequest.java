package com.LearningApp.User.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EnrollmentRequest {
    
    @NotBlank(message = "Course ID is required")
    private String courseId;
    
    private PaymentMethodRequest paymentData;
}
