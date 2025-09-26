package com.project.app.controller;

import com.project.app.dto.TutorDto;
import com.project.app.mapper.TutorMapper;
import com.project.app.model.Tutor;
import com.project.app.model.User;
import com.project.app.model.UserRole;
import com.project.app.repository.TutorRepository;
import com.project.app.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/profile")
public class ProfileController {

    private final UserRepository userRepository;
    private final TutorRepository tutorRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileController(UserRepository userRepository, TutorRepository tutorRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tutorRepository = tutorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/tutors")
    public ResponseEntity<List<TutorDto>> getTutors() {
        List<TutorDto> result = new ArrayList<>();

        // 1) Include existing Tutor documents
        for (Tutor t : tutorRepository.findAll()) {
            result.add(TutorMapper.toTutorDto(t));
        }

        // 2) Include Users with role TUTOR that don't yet have Tutor doc
        List<User> tutorUsers = userRepository.findByRole(UserRole.TUTOR);
        for (User u : tutorUsers) {
            boolean exists = tutorRepository.findById(u.getId()).isPresent();
            if (!exists) {
                TutorDto dto = new TutorDto();
                dto.setId(u.getId());
                dto.setPublicId(u.getPublicId());
                dto.setName(u.getName());
                dto.setAvatarUrl(u.getAvatarUrl());
                dto.setTitle(u.getBio() != null ? u.getBio() : ""); // fallback until dedicated title exists
                dto.setBio(u.getBio());
                dto.setRating(0.0);
                dto.setReviews(0);
                dto.setVerified(false);
                dto.setJoinDate(u.getJoinDate());
                result.add(dto);
            }
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User updates) {
        return userRepository.findById(id)
                .map(existing -> {
                    if (updates.getName() != null) existing.setName(updates.getName());
                    if (updates.getBio() != null) existing.setBio(updates.getBio());
                    if (updates.getTitle() != null) existing.setTitle(updates.getTitle());
                    if (updates.getAvatarUrl() != null) existing.setAvatarUrl(updates.getAvatarUrl());
                    // email/role/password not updated here
                    return ResponseEntity.ok(userRepository.save(existing));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/avatar")
    public ResponseEntity<?> uploadAvatar(Authentication auth, @RequestParam("file") MultipartFile file) throws IOException {
        String userEmail = auth.getName();
        User user = userRepository.findByEmail(userEmail).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        // For demo: store as data URL in DB (not recommended for production). Replace with real storage.
        String dataUrl = "data:" + file.getContentType() + ";base64," + java.util.Base64.getEncoder().encodeToString(file.getBytes());
        user.setAvatarUrl(dataUrl);
        userRepository.save(user);
        Map<String, Object> resp = new HashMap<>();
        resp.put("avatarUrl", user.getAvatarUrl());
        return ResponseEntity.ok(resp);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteAccount(Authentication auth) {
        String userEmail = auth.getName();
        User user = userRepository.findByEmail(userEmail).orElse(null);
        if (user == null) {
            // Even if user is not found, from a client perspective, the "deletion" is successful.
            return ResponseEntity.ok(Map.of("deleted", true));
        }
        userRepository.deleteById(user.getId());
        Map<String, Object> resp = new HashMap<>();
        resp.put("deleted", true);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(Authentication auth, @RequestBody Map<String, String> body) {
        String userEmail = auth.getName();
        User user = userRepository.findByEmail(userEmail).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("newPassword");

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.status(400).body(Map.of("message", "Incorrect current password"));
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }
}


