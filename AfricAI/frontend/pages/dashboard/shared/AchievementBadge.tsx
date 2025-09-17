import React from 'react';
import { AwardIcon } from '../../../components/icons/AwardIcon';

interface AchievementBadgeProps {
  title: string;
  date: string;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ title, date }) => {
  return (
    <div className="flex items-center bg-white/5 p-4 rounded-lg">
      <div className="p-3 bg-nebula-600/20 rounded-full mr-4">
        <AwardIcon className="w-6 h-6 text-nebula-700" />
      </div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-gray-400">Earned on {date}</p>
      </div>
    </div>
  );
};

export default AchievementBadge;
