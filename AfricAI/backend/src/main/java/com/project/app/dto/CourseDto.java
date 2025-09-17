package com.project.app.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.project.app.model.Difficulty;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class CourseDto {

    private String id;
    private String title;
    private String description;
    private String category;
    private String imageUrl;
    private List<ChapterDto> chapters;
    private double price;
    private Double rating;
    private Integer reviews;
    private TutorDto tutor;
    private Difficulty difficulty;

    // --- Getters and Setters ---

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<ChapterDto> getChapters() {
        return chapters;
    }

    public void setChapters(List<ChapterDto> chapters) {
        this.chapters = chapters;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getReviews() {
        return reviews;
    }

    public void setReviews(Integer reviews) {
        this.reviews = reviews;
    }

    public TutorDto getTutor() {
        return tutor;
    }

    public void setTutor(TutorDto tutor) {
        this.tutor = tutor;
    }

    public Difficulty getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(Difficulty difficulty) {
        this.difficulty = difficulty;
    }
}
