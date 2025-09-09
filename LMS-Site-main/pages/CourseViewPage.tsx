import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import { BookOpenIcon } from '../components/icons/BookOpenIcon';
import AITutor from '../components/AITutor';
import { mockCourses } from '../mockData';
import type { Course, Chapter } from '../types';
import StarRating from '../components/StarRating';

const CourseViewPage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    // In a real app, you'd fetch this data. We'll use mock data.
    const course: Course | undefined = mockCourses.find(c => c.id === courseId);
    const [activeTab, setActiveTab] = useState('chapters');

    if (!course) {
        return <div className="text-center py-20">Course not found.</div>;
    }

    const { title, description, chapters, price, tutor, rating = 0, reviews = 0 } = course;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <h1 className="text-4xl font-bold">{title}</h1>
                    
                    <div className="flex items-center gap-6 flex-wrap">
                        {tutor && (
                             <Link to={`/tutor/${tutor.id}`} className="inline-block">
                                <div className="flex items-center gap-4 group">
                                    <img src={tutor.avatarUrl} alt={tutor.name} className="w-12 h-12 rounded-full" />
                                    <div>
                                        <p className="font-semibold group-hover:text-nebula-600 transition-colors">{tutor.name}</p>
                                        <p className="text-sm text-gray-400">Instructor</p>
                                    </div>
                                </div>
                            </Link>
                        )}
                        
                        <div className="flex items-center gap-2">
                            <StarRating rating={rating} />
                            <span className="text-sm text-gray-400">{rating.toFixed(1)} ({reviews} reviews)</span>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4 border-b border-white/10 pb-2">About this course</h2>
                        <p className="text-gray-400 whitespace-pre-wrap pt-4">{description}</p>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-white/10">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            <button onClick={() => setActiveTab('chapters')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'chapters' ? 'border-nebula-600 text-nebula-600' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
                                Chapters
                            </button>
                            <button onClick={() => setActiveTab('tutor')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'tutor' ? 'border-nebula-600 text-nebula-600' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
                                AI Tutor
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div>
                        {activeTab === 'chapters' && (
                            <GlassCard className="p-6">
                                <ul className="space-y-4">
                                    {chapters.map((chapter: Chapter) => (
                                        <li key={chapter.id} className="flex items-center justify-between p-3 bg-white/5 rounded-md">
                                            <div className="flex items-center space-x-4">
                                                <BookOpenIcon className="w-5 h-5 text-gray-400" />
                                                <p>{chapter.title}</p>
                                            </div>
                                            <p className="text-sm text-gray-400">{chapter.duration} mins</p>
                                        </li>
                                    ))}
                                </ul>
                            </GlassCard>
                        )}
                        {activeTab === 'tutor' && <AITutor />}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <GlassCard className="p-6 sticky top-28">
                        <img src={course.imageUrl} alt={title} className="w-full h-auto rounded-lg mb-4" />
                        <p className="text-4xl font-bold text-center mb-4">${price.toFixed(2)}</p>
                        <Link to={`/checkout/${course.id}`} className="w-full">
                            <Button className="w-full text-lg">Enroll Now</Button>
                        </Link>
                        <p className="text-xs text-gray-400 text-center mt-4">30-Day Money-Back Guarantee</p>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default CourseViewPage;