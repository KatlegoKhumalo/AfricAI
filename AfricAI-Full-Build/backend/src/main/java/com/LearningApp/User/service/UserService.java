package com.LearningApp.User.service;

import com.LearningApp.User.DTO.SignupRequest;
import com.LearningApp.User.DTO.PaymentMethodRequest;
import com.LearningApp.User.DTO.TutorRegister;
import com.LearningApp.User.model.User;
import com.LearningApp.User.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public User createUser(SignupRequest signupRequest) {
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User.UserBuilder userBuilder = User.builder()
                .name(signupRequest.getName())
                .email(signupRequest.getEmail())
                .password(passwordEncoder.encode(signupRequest.getPassword()))
                .role(signupRequest.getRole())
                .verified(false)
                .joinDate(LocalDateTime.now());
        
        // Generate publicId for tutors
        if ("tutor".equals(signupRequest.getRole())) {
            String publicId = generateUniquePublicId();
            userBuilder.publicId(publicId);
            
            // Initialize tutor profile
            User.TutorProfile tutorProfile = User.TutorProfile.builder()
                    .title("AI Educator")
                    .subscription(User.Subscription.builder()
                            .status("inactive")
                            .build())
                    .build();
            userBuilder.tutorProfile(tutorProfile);
        } else {
            userBuilder.publicId(generateUniquePublicId());
        }
        
        User user = userBuilder.build();
        return userRepository.save(user);
    }
    
    public User createTutor(TutorRegister tutorRegister) {
        if (userRepository.existsByEmail(tutorRegister.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        String publicId = generateUniquePublicId();
        
        User.TutorProfile tutorProfile = User.TutorProfile.builder()
                .title("AI Educator")
                .subscription(User.Subscription.builder()
                        .status("inactive")
                        .build())
                .build();
        
        User user = User.builder()
                .name(tutorRegister.getFullName())
                .email(tutorRegister.getEmail())
                .password(passwordEncoder.encode(tutorRegister.getPassword()))
                .role("tutor")
                .publicId(publicId)
                .tutorProfile(tutorProfile)
                .verified(false)
                .joinDate(LocalDateTime.now())
                .build();
        
        return userRepository.save(user);
    }
    
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public Optional<User> findByPublicId(String publicId) {
        return userRepository.findByPublicId(publicId);
    }
    
    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }
    
    public User updatePaymentMethod(String userId, PaymentMethodRequest paymentRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Mask card number
        String maskedCardNumber = "************" + paymentRequest.getCardNumber().substring(12);
        
        User.PaymentMethod paymentMethod = User.PaymentMethod.builder()
                .cardNumber(maskedCardNumber)
                .expiryDate(paymentRequest.getExpiryDate())
                .nameOnCard(paymentRequest.getNameOnCard())
                .billingAddress(paymentRequest.getBillingAddress())
                .zipCode(paymentRequest.getZipCode())
                .build();
        
        user.setPaymentMethod(paymentMethod);
        user.setUpdatedAt(LocalDateTime.now());
        
        return userRepository.save(user);
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role);
    }
    
    public List<User> getActiveTutors() {
        return userRepository.findActiveTutors();
    }
    
    public List<User> getVerifiedTutors() {
        return userRepository.findVerifiedTutors();
    }
    
    public User updateUser(String userId, User updatedUser) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());
        user.setBio(updatedUser.getBio());
        user.setVerified(updatedUser.getVerified());
        user.setUpdatedAt(LocalDateTime.now());
        
        return userRepository.save(user);
    }
    
    public void deleteUser(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(userId);
    }
    
    public User activateTutorSubscription(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!"tutor".equals(user.getRole())) {
            throw new RuntimeException("User is not a tutor");
        }
        
        if (user.getTutorProfile() == null) {
            user.setTutorProfile(User.TutorProfile.builder()
                    .title("AI Educator")
                    .subscription(User.Subscription.builder()
                            .status("active")
                            .nextBillingDate(LocalDateTime.now().plusMonths(1))
                            .build())
                    .build());
        } else {
            User.Subscription subscription = user.getTutorProfile().getSubscription();
            if (subscription == null) {
                subscription = User.Subscription.builder()
                        .status("active")
                        .nextBillingDate(LocalDateTime.now().plusMonths(1))
                        .build();
            } else {
                subscription.setStatus("active");
                subscription.setNextBillingDate(LocalDateTime.now().plusMonths(1));
            }
            user.getTutorProfile().setSubscription(subscription);
        }
        
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }
    
    private String generateUniquePublicId() {
        String publicId;
        do {
            publicId = String.format("%07d", new Random().nextInt(10000000));
        } while (userRepository.existsByPublicId(publicId));
        return publicId;
    }
}