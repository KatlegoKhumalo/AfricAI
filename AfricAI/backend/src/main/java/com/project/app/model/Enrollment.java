package com.project.app.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Document(collection = "enrollments")
@CompoundIndex(name = "user_course_idx", def = "{userId: 1, courseId: 1}", unique = true)
public class Enrollment {

    @Id
    private String id;

    private String userId;
    private String courseId;
    private Date purchaseDate;

    // chapterId -> secondsWatched
    private Map<String, Integer> chapterProgress = new HashMap<>();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }

    public Date getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(Date purchaseDate) { this.purchaseDate = purchaseDate; }

    public Map<String, Integer> getChapterProgress() { return chapterProgress; }
    public void setChapterProgress(Map<String, Integer> chapterProgress) { this.chapterProgress = chapterProgress; }
}


