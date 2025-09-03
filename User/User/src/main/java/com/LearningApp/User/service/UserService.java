package com.LearningApp.User.service;

import com.LearningApp.User.DTO.TutorRegister;
import com.LearningApp.User.Repository.UserRepo;
import com.LearningApp.User.model.User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;

@Service
public class UserService {

    private final UserRepo repository;

    public UserService(UserRepo repository) {
        this.repository = repository;


    }
    public User createTutorId(TutorRegister tutorRegister){
        User user = new User();
        user.setTutorId(generateTutorId());
        return repository.save(user);
    }

    private String generateTutorId() {
        ArrayList<String> numbers = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            numbers.add(String.valueOf(i));
        }
        Collections.shuffle(numbers);

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 8; i++) {
            sb.append(numbers.get(i));
        }
        return sb.toString();
    }
}
