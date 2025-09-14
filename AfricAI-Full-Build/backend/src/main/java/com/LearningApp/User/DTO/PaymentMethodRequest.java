package com.LearningApp.User.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class PaymentMethodRequest {
    
    @NotBlank(message = "Card number is required")
    @Pattern(regexp = "\\d{16}", message = "Card number must be 16 digits")
    private String cardNumber;
    
    @NotBlank(message = "Expiry date is required")
    @Pattern(regexp = "\\d{2}/\\d{2}", message = "Expiry date must be in MM/YY format")
    private String expiryDate;
    
    @NotBlank(message = "CVV is required")
    @Pattern(regexp = "\\d{3,4}", message = "CVV must be 3 or 4 digits")
    private String cvv;
    
    @NotBlank(message = "Name on card is required")
    private String nameOnCard;
    
    @NotBlank(message = "Billing address is required")
    private String billingAddress;
    
    @NotBlank(message = "ZIP code is required")
    private String zipCode;
}
