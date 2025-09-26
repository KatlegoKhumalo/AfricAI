package com.project.app.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    // Accept either email or 7-digit tutorId
    @NotBlank
    private String identifier;

    @NotBlank
    private String password;

    // --- Getters and Setters ---

    public String getIdentifier() { return identifier; }
    public void setIdentifier(String identifier) { this.identifier = identifier; }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
