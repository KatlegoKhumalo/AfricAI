import React from 'react';
import { Link } from 'react-router-dom';
import GlassCard from './GlassCard';
import { mockTutors } from '../mockData';
import StarRating from './StarRating';

const TopTutorsCarousel: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockTutors.slice(0, 6).map(tutor => (
            <Link to={`/tutor/${tutor.id}`} key={tutor.id} className="block group">
                <GlassCard className="p-6 flex flex-col items-center text-center gap-4 h-full">
                    <img src={tutor.avatarUrl} alt={tutor.name} className="w-24 h-24 rounded-full object-cover flex-shrink-0" />
                    <div className="flex-1">
                        <h3 className="text-xl font-bold group-hover:text-nebula-600 transition-colors">{tutor.name}</h3>
                        <p className="text-nebula-700 text-sm font-semibold">{tutor.title}</p>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <StarRating rating={tutor.rating} />
                            <span className="text-sm text-gray-400">({tutor.reviews} reviews)</span>
                        </div>
                    </div>
                </GlassCard>
            </Link>
        ))}
    </div>
  );
};

export default TopTutorsCarousel;
