package com.LearningApp.User.DTO;

import lombok.Data;

@Data
public class CreateCourseDTO {
    public  TutorRegister tutor;
    public  courseDTO courses;

    public void setCourses(courseDTO courses) {
        this.courses = courses;
    }

    public courseDTO getCourses() {
        return courses;
    }

    public void setTutor(TutorRegister tutor) {
        this.tutor = tutor;
    }

    public TutorRegister getTutor() {
        return tutor;
    }
}
