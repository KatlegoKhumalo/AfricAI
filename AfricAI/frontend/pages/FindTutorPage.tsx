import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockTutors } from '../mockData';
import { listMergedTutors } from '../services/tutorService';
import { useAuth } from '../context/AuthContext';
import TutorCard from '../components/TutorCard';
import TutorCardSkeleton from '../components/TutorCardSkeleton';
import { SearchIcon } from '../components/icons/SearchIcon';
import type { Tutor } from '../types';

const specialties = ['All', 'Development', 'Data Science', 'Creative', 'Design', 'Business', 'AI Ethics'];

const FindTutorPage: React.FC = () => {
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSpecialty, setSelectedSpecialty] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [minRating, setMinRating] = useState(0);
    const { user } = useAuth();
    
    useEffect(() => {
        const fetchTutors = async () => {
            setIsLoading(true);
            try {
                const merged = await listMergedTutors(user || null);
                setTutors(merged);
            } catch (error) {
                console.error('Failed to load tutors, falling back to mock data:', error);
                setTutors(mockTutors);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTutors();
    }, [user]);

    const filteredTutors = useMemo(() => {
        if (isLoading) return [];
        return tutors.filter(tutor => {
            const searchMatch = tutor.name.toLowerCase().includes(searchTerm.toLowerCase());
            const ratingMatch = (tutor.rating || 0) >= minRating;
            return searchMatch && ratingMatch;
        });
    }, [searchTerm, tutors, isLoading, minRating]);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-6">
                <h1 className="text-4xl font-bold">Find a Tutor</h1>
            </div>
            <p className="text-gray-400 text-center mb-10 max-w-2xl mx-auto">
                Connect with our world-class tutors. Browse by specialty or search for an expert to help you achieve your learning goals.
            </p>

            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-12">
                 <div className="relative w-full md:w-auto md:flex-1 max-w-lg">
                    <input
                        type="text"
                        placeholder="Search by name or title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
            </div>

            {/* Specialty Filters */}
            <div className="flex justify-center flex-wrap gap-2 mb-12">
                {specialties.map(specialty => (
                    <button
                        key={specialty}
                        onClick={() => setSelectedSpecialty(specialty)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
                            selectedSpecialty === specialty
                                ? 'bg-gradient-to-r from-nebula-700 to-nebula-600 text-white shadow-lg'
                                : 'bg-white/10 hover:bg-white/20 text-gray-300'
                        }`}
                    >
                        {specialty}
                    </button>
                ))}
            </div>

            {/* Tutors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {isLoading ? (
                    Array.from({ length: 8 }).map((_, index) => <TutorCardSkeleton key={index} />)
                ) : (
                    filteredTutors.map(tutor => (
                        <Link to={`/tutor/${tutor.id}`} key={tutor.id}>
                            <TutorCard tutor={tutor} />
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default FindTutorPage;