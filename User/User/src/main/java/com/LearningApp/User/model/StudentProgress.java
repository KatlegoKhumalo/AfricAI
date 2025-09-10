//package com.LearningApp.User.model;
//
//import jakarta.persistence.*;
//import lombok.Data;
//import lombok.EqualsAndHashCode;
//
//@EqualsAndHashCode(callSuper = true)
//@Entity
//@Data
//public class StudentProgress extends course {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private int Id;
//    private int NumberOfCompletedTasks;
//    private int TotalTasks;
//    private double Percentage;
//
//    @ManyToOne
//    @Column(name = "user_id",nullable = false)
//    private User user;
//
//}
