import React from 'react';
import { StarIcon } from './icons/StarIcon';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, maxRating = 5, className }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = maxRating - fullStars - (halfStar ? 1 : 0);

  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(fullStars)].map((_, i) => (
        <StarIcon key={`full-${i}`} className="w-5 h-5 text-yellow-400 fill-current" />
      ))}
      {halfStar && <StarIcon key="half" className="w-5 h-5 text-yellow-400 fill-current" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }} />}
      {[...Array(emptyStars)].map((_, i) => (
        <StarIcon key={`empty-${i}`} className="w-5 h-5 text-gray-600 fill-current" />
      ))}
    </div>
  );
};

export default StarRating;
