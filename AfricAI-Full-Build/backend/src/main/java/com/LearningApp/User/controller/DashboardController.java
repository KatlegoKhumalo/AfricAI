package com.LearningApp.User.controller;

import com.LearningApp.User.model.Enrollment;
import com.LearningApp.User.model.Transaction;
import com.LearningApp.User.security.JwtUtil;
import com.LearningApp.User.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class DashboardController {
    
    private final UserService userService;
    private final CourseService courseService;
    private final EnrollmentService enrollmentService;
    private final LiveSessionService liveSessionService;
    private final TransactionService transactionService;
    private final JwtUtil jwtUtil;
    
    @GetMapping("/learner")
    public ResponseEntity<?> getLearnerDashboard(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String userId = jwtUtil.getUserIdFromToken(jwt);
            String role = jwtUtil.getRoleFromToken(jwt);
            
            if (!"learner".equals(role)) {
                return ResponseEntity.status(403).body(createErrorResponse("Access denied"));
            }
            
            List<Enrollment> enrollments = enrollmentService.getLearnerEnrollments(userId);
            List<Enrollment> completedCourses = enrollmentService.getCompletedCourses(userId);
            List<Enrollment> inProgressCourses = enrollmentService.getInProgressCourses(userId);
            List<Transaction> userTransactions = transactionService.getUserTransactions(userId);
            Double totalSpent = transactionService.getUserTotalSpent(userId);
            
            Map<String, Object> dashboard = new HashMap<>();
            dashboard.put("enrollments", enrollments);
            dashboard.put("completedCourses", completedCourses);
            dashboard.put("inProgressCourses", inProgressCourses);
            dashboard.put("totalCourses", enrollments.size());
            dashboard.put("completedCount", completedCourses.size());
            dashboard.put("inProgressCount", inProgressCourses.size());
            dashboard.put("totalSpent", totalSpent);
            dashboard.put("transactions", userTransactions);
            
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            log.error("Get learner dashboard error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/tutor")
    public ResponseEntity<?> getTutorDashboard(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String userId = jwtUtil.getUserIdFromToken(jwt);
            String role = jwtUtil.getRoleFromToken(jwt);
            
            if (!"tutor".equals(role)) {
                return ResponseEntity.status(403).body(createErrorResponse("Access denied"));
            }
            
            List<com.LearningApp.User.model.Course> courses = courseService.getCoursesByTutor(userId);
            List<com.LearningApp.User.model.LiveSession> upcomingSessions = liveSessionService.getUpcomingSessionsByTutor(userId);
            List<Transaction> tutorTransactions = transactionService.getUserTransactions(userId);
            Double totalEarnings = transactionService.getUserTotalSpent(userId);
            
            // Calculate total students (from enrollments)
            int totalStudents = 0;
            for (com.LearningApp.User.model.Course course : courses) {
                List<Enrollment> courseEnrollments = enrollmentService.getCourseEnrollments(course.getId());
                totalStudents += courseEnrollments.size();
            }
            
            Map<String, Object> dashboard = new HashMap<>();
            dashboard.put("courses", courses);
            dashboard.put("upcomingSessions", upcomingSessions);
            dashboard.put("totalCourses", courses.size());
            dashboard.put("totalStudents", totalStudents);
            dashboard.put("totalEarnings", totalEarnings);
            dashboard.put("transactions", tutorTransactions);
            
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            log.error("Get tutor dashboard error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/admin")
    public ResponseEntity<?> getAdminDashboard(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String role = jwtUtil.getRoleFromToken(jwt);
            
            if (!"admin".equals(role)) {
                return ResponseEntity.status(403).body(createErrorResponse("Access denied"));
            }
            
            List<com.LearningApp.User.model.User> allUsers = userService.getAllUsers();
            List<com.LearningApp.User.model.User> tutors = userService.getUsersByRole("tutor");
            List<com.LearningApp.User.model.User> learners = userService.getUsersByRole("learner");
            List<com.LearningApp.User.model.Course> allCourses = courseService.getAllCourses();
            List<Transaction> allTransactions = transactionService.getAllCourseSales();
            List<Transaction> allSubscriptions = transactionService.getAllTutorSubscriptions();
            
            Double totalRevenue = transactionService.getTotalRevenue();
            Double courseSalesRevenue = transactionService.getTotalCourseSales();
            Double subscriptionRevenue = transactionService.getTotalSubscriptionRevenue();
            
            Map<String, Object> dashboard = new HashMap<>();
            dashboard.put("totalUsers", allUsers.size());
            dashboard.put("totalTutors", tutors.size());
            dashboard.put("totalLearners", learners.size());
            dashboard.put("totalCourses", allCourses.size());
            dashboard.put("totalRevenue", totalRevenue);
            dashboard.put("courseSalesRevenue", courseSalesRevenue);
            dashboard.put("subscriptionRevenue", subscriptionRevenue);
            dashboard.put("recentTransactions", allTransactions);
            dashboard.put("recentSubscriptions", allSubscriptions);
            
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            log.error("Get admin dashboard error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}
