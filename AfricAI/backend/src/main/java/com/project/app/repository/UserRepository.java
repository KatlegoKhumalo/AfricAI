package com.project.app.repository;

import com.project.app.model.User;
import com.project.app.model.UserRole;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailIgnoreCase(String email);
    Optional<User> findByTutorId(String tutorId);
    Optional<User> findByResetToken(String token);
    List<User> findByRole(UserRole role);
}
