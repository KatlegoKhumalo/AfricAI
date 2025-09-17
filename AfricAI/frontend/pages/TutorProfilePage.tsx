import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockTutors } from '../mockData';
import GlassCard from '../components/GlassCard';
import StarRating from '../components/StarRating';
import Button from '../components/Button';
import CourseCard from '../components/CourseCard';
import CourseCardSkeleton from '../components/CourseCardSkeleton';
import ContactTutorModal from '../components/ContactTutorModal';
import { CheckBadgeIcon } from '../components/icons/CheckBadgeIcon';
import { MessageSquareIcon } from '../components/icons/MessageSquareIcon';
import type { Tutor } from '../types';

const TutorProfilePage: React.FC = () => {
    const { tutorId } = useParams<{ tutorId: string }>();
    const [tutor, setTutor] = useState<Tutor | null | undefined>(undefined);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    useEffect(() => {
        setTutor(undefined); // Set to loading state
        const timer = setTimeout(() => {
            const foundTutor = mockTutors.find(t => t.id === tutorId);
            setTutor(foundTutor || null);
        }, 1000);
        return () => clearTimeout(timer);
    }, [tutorId]);

    if (tutor === undefined) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
                <GlassCard className="p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-40 h-40 rounded-full bg-gray-700/50 flex-shrink-0"></div>
                        <div className="text-center md:text-left w-full">
                            <div className="h-10 bg-gray-700/50 rounded w-1/2 mx-auto md:mx-0 mb-2"></div>
                            <div className="h-6 bg-gray-700/50 rounded w-1/3 mx-auto md:mx-0 mb-4"></div>
                            <div className="h-5 bg-gray-700/50 rounded w-1/4 mx-auto md:mx-0 mb-4"></div>
                            <div className="h-4 bg-gray-700/50 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-700/50 rounded w-5/6 mb-4"></div>
                            <div className="h-12 bg-gray-700/50 rounded w-48 mx-auto md:mx-0"></div>
                        </div>
                    </div>
                </GlassCard>
                <div className="h-9 bg-gray-700/50 rounded w-1/3 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 3 }).map((_, i) => <CourseCardSkeleton key={i} />)}
                </div>
            </div>
        );
    }

    if (!tutor) {
        return <div className="text-center py-20">Tutor not found.</div>;
    }

    const upcomingSessions = tutor.schedule.filter(s => s.startTime > new Date());

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <GlassCard className="p-8 mb-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <img src={tutor.avatarUrl} alt={tutor.name} className="w-40 h-40 rounded-full object-cover flex-shrink-0" />
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-bold flex items-center justify-center md:justify-start gap-2">
                            {tutor.name}
                            {tutor.verified && <CheckBadgeIcon className="w-7 h-7 text-blue-400" />}
                        </h1>
                        <p className="text-lg text-nebula-600 font-semibold mt-1">{tutor.title}</p>
                        <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                            <StarRating rating={tutor.rating} />
                            <span className="text-sm text-gray-400">({tutor.reviews} reviews)</span>
                        </div>
                        <p className="text-gray-300 mt-4 max-w-2xl">{tutor.bio}</p>
                        <Button className="mt-6" onClick={() => setIsContactModalOpen(true)}>
                            <MessageSquareIcon className="w-5 h-5 mr-2" />
                            Message {tutor.name.split(' ')[0]}
                        </Button>
                    </div>
                </div>
            </GlassCard>

            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Courses by {tutor.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tutor.courses.map(course => (
                        <Link to={`/course/${course.id}`} key={course.id}>
                            <CourseCard course={course} />
                        </Link>
                    ))}
                </div>
            </section>

             <section>
                <h2 className="text-3xl font-bold mb-6">Upcoming Live Sessions</h2>
                {upcomingSessions.length > 0 ? (
                    <GlassCard className="p-6">
                        <ul className="space-y-4">
                            {upcomingSessions.map(session => (
                                <li key={session.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-white/5 rounded-md">
                                    <div>
                                        <p className="font-semibold">{session.title}</p>
                                        <p className="text-sm text-gray-400">{session.startTime.toLocaleString()}</p>
                                    </div>
                                    <Link to={`/live-session/${session.id}`}>
                                        <Button size="sm" variant="secondary" className="mt-2 sm:mt-0">Join Session</Button>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </GlassCard>
                ) : (
                    <p className="text-gray-400">No upcoming live sessions scheduled.</p>
                )}
            </section>

            <ContactTutorModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                tutorName={tutor.name}
            />
        </div>
    );
};

export default TutorProfilePage;