package com.project.app.mapper;

import com.project.app.dto.TutorDto;
import com.project.app.model.Tutor;

public class TutorMapper {

    public static TutorDto toTutorDto(Tutor tutor) {
        if (tutor == null) {
            return null;
        }

        TutorDto dto = new TutorDto();
        dto.setId(tutor.getId());
        dto.setPublicId(tutor.getPublicId());
        dto.setName(tutor.getName());
        dto.setAvatarUrl(tutor.getAvatarUrl());
        dto.setTitle(tutor.getTitle());
        dto.setBio(tutor.getBio());
        dto.setRating(tutor.getRating());
        dto.setReviews(tutor.getReviews());
        dto.setVerified(tutor.isVerified());
        dto.setJoinDate(tutor.getJoinDate());
        // Note: The 'courses' list is intentionally left null.
        // The service layer will be responsible for populating this to avoid circular mapping.

        return dto;
    }
}
