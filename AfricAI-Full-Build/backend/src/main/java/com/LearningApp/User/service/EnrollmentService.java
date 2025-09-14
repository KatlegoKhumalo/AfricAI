package com.LearningApp.User.service;

import com.LearningApp.User.DTO.EnrollmentRequest;
import com.LearningApp.User.DTO.PaymentMethodRequest;
import com.LearningApp.User.model.Course;
import com.LearningApp.User.model.Enrollment;
import com.LearningApp.User.model.Transaction;
import com.LearningApp.User.model.User;
import com.LearningApp.User.repository.CourseRepository;
import com.LearningApp.User.repository.EnrollmentRepository;
import com.LearningApp.User.repository.TransactionRepository;
import com.LearningApp.User.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class EnrollmentService {
    
    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    
    public Enrollment enrollInCourse(String learnerId, EnrollmentRequest enrollmentRequest) {
        // Check if already enrolled
        if (enrollmentRepository.existsByLearnerIdAndCourseId(learnerId, enrollmentRequest.getCourseId())) {
            throw new RuntimeException("Already enrolled in this course");
        }
        
        // Verify course exists
        Course course = courseRepository.findById(enrollmentRequest.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        // Create enrollment
        Enrollment enrollment = Enrollment.builder()
                .learnerId(learnerId)
                .courseId(enrollmentRequest.getCourseId())
                .progress(0)
                .enrolledAt(LocalDateTime.now())
                .build();
        
        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
        
        // Create transaction record
        Transaction transaction = Transaction.builder()
                .userId(learnerId)
                .type("Course Sale")
                .amount(course.getPrice())
                .description("Enrollment: " + course.getTitle())
                .relatedCourseId(course.getId())
                .date(LocalDateTime.now())
                .build();
        
        transactionRepository.save(transaction);
        
        // Update user's payment method if provided
        if (enrollmentRequest.getPaymentData() != null) {
            updateUserPaymentMethod(learnerId, enrollmentRequest.getPaymentData());
        }
        
        return savedEnrollment;
    }
    
    public List<Enrollment> getLearnerEnrollments(String learnerId) {
        return enrollmentRepository.findByLearnerId(learnerId);
    }
    
    public List<Enrollment> getCourseEnrollments(String courseId) {
        return enrollmentRepository.findByCourseId(courseId);
    }
    
    public Optional<Enrollment> getEnrollment(String learnerId, String courseId) {
        return enrollmentRepository.findByLearnerIdAndCourseId(learnerId, courseId);
    }
    
    public List<Enrollment> getCompletedCourses(String learnerId) {
        return enrollmentRepository.findCompletedCoursesByLearnerId(learnerId);
    }
    
    public List<Enrollment> getInProgressCourses(String learnerId) {
        return enrollmentRepository.findInProgressCoursesByLearnerId(learnerId);
    }
    
    public Enrollment updateProgress(String learnerId, String courseId, Integer progress) {
        Enrollment enrollment = enrollmentRepository.findByLearnerIdAndCourseId(learnerId, courseId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        
        if (progress < 0 || progress > 100) {
            throw new RuntimeException("Progress must be between 0 and 100");
        }
        
        enrollment.setProgress(progress);
        return enrollmentRepository.save(enrollment);
    }
    
    public boolean isEnrolled(String learnerId, String courseId) {
        return enrollmentRepository.existsByLearnerIdAndCourseId(learnerId, courseId);
    }
    
    private void updateUserPaymentMethod(String userId, PaymentMethodRequest paymentRequest) {
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
        userRepository.save(user);
    }
}
