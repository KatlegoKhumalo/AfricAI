package com.LearningApp.User.service;

import com.LearningApp.User.DTO.StudentLogin;
import com.LearningApp.User.DTO.StudentRegister;
import com.LearningApp.User.DTO.TutorRegister;
import com.LearningApp.User.Repository.UserRepo;
import com.LearningApp.User.model.User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Optional;

@Service
public class UserService {


    private final UserRepo repository;

    public UserService(UserRepo repository) {
        this.repository = repository;


    }
    public User createTutor(TutorRegister tutorRegister){
        try{User user = new User();
        user.setFullName(tutorRegister.getFullName());
        user.setEmail(tutorRegister.getEmail());
        user.setPassword(tutorRegister.getPassword());
        user.setTutorId(generateTutorId());
        return repository.save(user);} catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
    public User createUser(StudentRegister studentRegister){
        User user = new User();
        user.setFullName(studentRegister.getFullName());
        user.setEmail(studentRegister.getEmail());
        user.setPassword(studentRegister.getPassword());
        user.setIdNumber(studentRegister.getIdNumber());

        return repository.save(user);

    }
//    public Optional<Boolean> StudentLogin(StudentLogin studentLogin){
//
//        return Optional.of(repository.findByEmail(studentLogin.getEmail()).map(user -> user.getPassword().equals(studentLogin.getPassword())).orElse(false));
//    }

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
