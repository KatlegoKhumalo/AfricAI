import React from 'react';
import type { Course } from '../types';
import StarRating from './StarRating';
import GlassCard from './GlassCard';
import Pill from './Pill';
import { formatRand } from '../utils/currency';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { imageUrl, category, title, rating = 0, reviews = 0, price, progress, score } = course;

  return (
    <GlassCard className="overflow-hidden h-full flex flex-col">
      <div className="relative">
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
        <span className="absolute top-3 right-3 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded-full">{category}</span>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg flex-grow mb-2">{title}</h3>
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <StarRating rating={rating} />
                <span className="text-xs text-gray-400">({reviews})</span>
            </div>
            {score !== undefined ? (
                 <Pill color={score >= 60 ? 'green' : 'red'}>
                    Score: {score}%
                </Pill>
            ) : (
                 <span className="font-bold text-lg">{formatRand(price)}</span>
            )}
        </div>
        {progress !== undefined && (
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                 <div className="bg-gradient-to-r from-nebula-700 to-nebula-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
        )}
      </div>
    </GlassCard>
  );
};

export default CourseCard;