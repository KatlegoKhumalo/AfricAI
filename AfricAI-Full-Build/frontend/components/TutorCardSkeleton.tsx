import React from 'react';
import GlassCard from './GlassCard';

const TutorCardSkeleton: React.FC = () => {
  return (
    <GlassCard className="p-6 flex flex-col items-center text-center h-full group animate-pulse">
      <div className="w-24 h-24 rounded-full mb-4 bg-gray-700/50"></div>
      <div className="flex-1 w-full">
        <div className="h-6 bg-gray-700/50 rounded w-1/2 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-700/50 rounded w-3/4 mx-auto mb-2"></div>
        <div className="flex items-center justify-center gap-2 mt-2 mb-4">
          <div className="h-5 w-24 bg-gray-700/50 rounded"></div>
        </div>
        <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-700/50 rounded w-full"></div>
            <div className="h-4 bg-gray-700/50 rounded w-5/6 mx-auto"></div>
        </div>
        <div className="h-10 bg-gray-700/50 rounded-md w-full"></div>
      </div>
    </GlassCard>
  );
};

export default TutorCardSkeleton;
