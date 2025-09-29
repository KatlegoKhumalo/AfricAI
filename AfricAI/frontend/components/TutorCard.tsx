import React from 'react';
import type { Tutor } from '../types';
import GlassCard from './GlassCard';
import StarRating from './StarRating';
import Button from './Button';
import { CheckBadgeIcon } from './icons/CheckBadgeIcon';

interface TutorCardProps {
  tutor: Tutor;
}

const TutorCard: React.FC<TutorCardProps> = ({ tutor }) => {
  const avatarSrc = tutor.avatarUrl || '/assets/images/default-avatar.svg';
  return (
    <GlassCard className="p-6 flex flex-col items-center text-center h-full group">
      <img src={avatarSrc} alt={tutor.name} className="w-24 h-24 rounded-full mb-4 object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/assets/images/default-avatar.svg'; }} />
      <h3 className="text-xl font-bold group-hover:text-nebula-600 transition-colors flex items-center gap-1.5">
          {tutor.name}
          {tutor.verified && <CheckBadgeIcon className="w-5 h-5 text-blue-400" />}
      </h3>
      <p className="text-nebula-700 text-sm font-semibold mb-2">{tutor.title}</p>
      <div className="flex items-center gap-2 mb-4">
        <StarRating rating={tutor.rating} />
        <span className="text-xs text-gray-400">({tutor.reviews} reviews)</span>
      </div>
      <p className="text-gray-400 text-sm flex-grow mb-4">
        {typeof tutor.bio === 'string' ? `${tutor.bio.substring(0, 100)}...` : ''}
      </p>
      <Button variant="secondary" className="w-full">View Profile</Button>
    </GlassCard>
  );
};

export default TutorCard;