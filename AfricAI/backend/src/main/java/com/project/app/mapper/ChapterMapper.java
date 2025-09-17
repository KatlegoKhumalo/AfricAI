package com.project.app.mapper;

import com.project.app.dto.ChapterDto;
import com.project.app.model.Chapter;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class ChapterMapper {

    public static ChapterDto toChapterDto(Chapter chapter) {
        if (chapter == null) {
            return null;
        }

        ChapterDto dto = new ChapterDto();
        dto.setId(chapter.getId());
        dto.setTitle(chapter.getTitle());
        dto.setDuration(chapter.getDuration());
        dto.setVideoUrl(chapter.getVideoUrl());
        dto.setContent(chapter.getContent());

        return dto;
    }

    public static List<ChapterDto> toChapterDtoList(List<Chapter> chapters) {
        if (chapters == null || chapters.isEmpty()) {
            return Collections.emptyList();
        }

        return chapters.stream()
                .map(ChapterMapper::toChapterDto)
                .collect(Collectors.toList());
    }
}
