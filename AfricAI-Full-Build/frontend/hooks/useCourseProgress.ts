import { useState, useEffect, useCallback } from 'react';
import type { Course } from '../types';

// The shape of our progress data in localStorage
type ProgressData = Record<string, string[]>; // { [courseId]: [completedChapterId1, ...] }

const PROGRESS_STORAGE_KEY = 'africai-course-progress';

const getInitialProgress = (): ProgressData => {
    try {
        const item = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
        return item ? JSON.parse(item) : {};
    } catch (error) {
        console.error("Error reading progress from localStorage", error);
        return {};
    }
};

export const useCourseProgress = () => {
    const [progress, setProgress] = useState<ProgressData>(getInitialProgress);

    useEffect(() => {
        try {
            window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
        } catch (error) {
            console.error("Error saving progress to localStorage", error);
        }
    }, [progress]);

    const getCompletedChapters = useCallback((courseId: string): string[] => {
        return progress[courseId] || [];
    }, [progress]);

    const isChapterCompleted = useCallback((courseId: string, chapterId: string): boolean => {
        return (progress[courseId] || []).includes(chapterId);
    }, [progress]);
    
    const markChapterAsComplete = useCallback((courseId: string, chapterId: string) => {
        setProgress(prevProgress => {
            const completedChapters = prevProgress[courseId] || [];
            if (completedChapters.includes(chapterId)) {
                return prevProgress; // Already complete
            }
            return {
                ...prevProgress,
                [courseId]: [...completedChapters, chapterId],
            };
        });
    }, []);

    const calculateProgress = useCallback((course: Course): number => {
        if (!course || !course.chapters || course.chapters.length === 0) {
            return 0;
        }
        const completedChapters = getCompletedChapters(course.id);
        const progressPercentage = (completedChapters.length / course.chapters.length) * 100;
        return Math.round(progressPercentage);

    }, [getCompletedChapters]);

    return {
        isChapterCompleted,
        markChapterAsComplete,
        calculateProgress,
    };
};
