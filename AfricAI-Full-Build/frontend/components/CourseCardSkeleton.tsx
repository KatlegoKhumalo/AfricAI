import React from 'react';
import GlassCard from './GlassCard';

const CourseCardSkeleton: React.FC = () => {
  return (
    <GlassCard className="overflow-hidden h-full flex flex-col animate-pulse">
      <div className="relative">
        <div className="w-full h-48 bg-gray-700/50"></div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="h-6 bg-gray-700/50 rounded w-3/4 mb-4"></div>
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <div className="h-5 w-24 bg-gray-700/50 rounded"></div>
            </div>
            <div className="h-8 w-20 bg-gray-700/50 rounded"></div>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2.5"></div>
      </div>
    </GlassCard>
  );
};

export default CourseCardSkeleton;
