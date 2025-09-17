package com.project.app.repository;

import com.project.app.model.Tutor;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TutorRepository extends MongoRepository<Tutor, String> {
}
