import { useState, useEffect, useCallback } from 'react';
import type { TestResult } from '../types';
import { generateUniqueId } from '../mockData';

const RESULTS_STORAGE_KEY = 'africai-test-results';

const getInitialResults = (): TestResult[] => {
    try {
        const item = window.localStorage.getItem(RESULTS_STORAGE_KEY);
        return item ? JSON.parse(item) : [];
    } catch (error) {
        console.error("Error reading test results from localStorage", error);
        return [];
    }
};

export const useTestResults = () => {
    const [results, setResults] = useState<TestResult[]>(getInitialResults);

    useEffect(() => {
        try {
            window.localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(results));
        } catch (error) {
            console.error("Error saving test results to localStorage", error);
        }
    }, [results]);

    const saveTestResult = useCallback((resultData: Omit<TestResult, 'id' | 'dateTaken' | 'status'>) => {
        const score = Math.round(resultData.score);
        const newResult: TestResult = {
            ...resultData,
            score,
            id: generateUniqueId(),
            dateTaken: new Date().toISOString(),
            status: score >= 60 ? 'Pass' : 'Fail',
        };

        setResults(prevResults => [...prevResults, newResult]);
        return newResult;
    }, []);

    const getAllResults = useCallback(() => {
        return results.sort((a, b) => new Date(b.dateTaken).getTime() - new Date(a.dateTaken).getTime());
    }, [results]);

    const getResultsForUser = useCallback((userId: string) => {
        return results.filter(r => r.userId === userId);
    }, [results]);

    const getLatestResultForUserCourse = useCallback((userId: string, courseId: string): TestResult | null => {
        const userCourseResults = results
            .filter(r => r.userId === userId && r.courseId === courseId)
            .sort((a, b) => new Date(b.dateTaken).getTime() - new Date(a.dateTaken).getTime());

        return userCourseResults[0] || null;
    }, [results]);

    return {
        saveTestResult,
        getAllResults,
        getResultsForUser,
        getLatestResultForUserCourse,
    };
};
