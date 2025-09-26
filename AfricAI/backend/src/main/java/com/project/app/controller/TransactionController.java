package com.project.app.controller;

import com.project.app.model.Transaction;
import com.project.app.model.User;
import com.project.app.repository.TransactionRepository;
import com.project.app.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transactions")
public class TransactionController {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionController(TransactionRepository transactionRepository, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/mine")
    public ResponseEntity<List<Transaction>> getMyTransactions(Authentication auth) {
        String userEmail = auth.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(transactionRepository.findByUserId(user.getId()));
    }
}
