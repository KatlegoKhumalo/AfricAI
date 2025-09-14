

import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockCourses, mockTests } from '../mockData';
import type { QuizQuestion, TestResult } from '../types';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';
import { useTestResults } from '../hooks/useTestResults';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { XCircleIcon } from '../components/icons/XCircleIcon';

const TestPage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { saveTestResult } = useTestResults();

    const course = mockCourses.find(c => c.id === courseId);
    const test = mockTests.find(t => t.courseId === courseId);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [finalResult, setFinalResult] = useState<TestResult | null>(null);

    const currentQuestion: QuizQuestion | undefined = test?.questions[currentQuestionIndex];

    const handleAnswerSelect = (questionId: string, answer: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < (test?.questions.length || 0) - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };
    
    const handleSubmit = () => {
        if (!test || !user) return;

        let correctAnswers = 0;
        test.questions.forEach(q => {
            if (answers[q.id] === q.correctAnswer) {
                correctAnswers++;
            }
        });

        const score = (correctAnswers / test.questions.length) * 100;
        const result = saveTestResult({
            userId: user.id,
            courseId: test.courseId,
            score: score,
        });
        setFinalResult(result);
    };

    if (!course || !test) {
        return <div className="h-screen w-full flex items-center justify-center bg-black text-white">Test not found.</div>;
    }

    if (finalResult) {
        const isPass = finalResult.status === 'Pass';
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <GlassCard className="max-w-lg w-full p-8 text-center">
                    {isPass ? (
                        <CheckCircleIcon className="w-20 h-20 text-green-400 mx-auto mb-4" />
                    ) : (
                        <XCircleIcon className="w-20 h-20 text-red-400 mx-auto mb-4" />
                    )}
                    <h1 className="text-3xl font-bold mb-2">Test Complete!</h1>
                    <p className="text-gray-300 mb-4">You have completed the test for "{course.title}".</p>
                    <p className={`text-5xl font-bold mb-4 ${isPass ? 'text-green-400' : 'text-red-400'}`}>{finalResult.score.toFixed(0)}%</p>
                    <p className={`text-xl font-semibold mb-6 ${isPass ? 'text-green-400' : 'text-red-400'}`}>
                        Result: {finalResult.status}
                    </p>
                    <Button onClick={() => navigate(`/course/${courseId}`)}>Back to Course</Button>
                </GlassCard>
            </div>
        );
    }
    
    if (!currentQuestion) return null;

    return (
        <div className="min-h-screen bg-black text-white flex flex-col p-4 md:p-8">
            <header className="mb-6">
                <h1 className="text-3xl font-bold">{course.title} Test</h1>
                <p className="text-gray-400">Question {currentQuestionIndex + 1} of {test.questions.length}</p>
                <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                    <div className="bg-gradient-to-r from-nebula-700 to-nebula-600 h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / test.questions.length) * 100}%` }}></div>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center">
                <GlassCard className="w-full max-w-3xl p-8">
                    <h2 className="text-2xl font-semibold mb-6">{currentQuestion.question}</h2>
                    <div className="space-y-4">
                        {currentQuestion.options.map(option => (
                            <button
                                key={option}
                                onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                                className={`block w-full text-left p-4 rounded-lg border-2 transition-colors duration-200 ${
                                    answers[currentQuestion.id] === option 
                                    ? 'bg-nebula-600/30 border-nebula-600' 
                                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </GlassCard>
            </main>

            <footer className="mt-6 flex justify-between items-center">
                <Button variant="secondary" onClick={() => navigate(`/course/${courseId}`)}>Exit Test</Button>
                {currentQuestionIndex < test.questions.length - 1 ? (
                     <Button onClick={handleNext} disabled={!answers[currentQuestion.id]}>
                        Next Question
                    </Button>
                ) : (
                    <Button onClick={handleSubmit} disabled={!answers[currentQuestion.id]} className="bg-green-600 hover:bg-green-500">
                        Submit Test
                    </Button>
                )}
            </footer>
        </div>
    );
};

export default TestPage;