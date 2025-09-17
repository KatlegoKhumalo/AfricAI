import React from 'react';
import GlassCard from '../../../components/GlassCard';
import { LucideIconProps } from '../../../components/icons/LucideIcon';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.FC<LucideIconProps>;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon }) => {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="bg-nebula-600/20 p-3 rounded-full">
          <Icon className="w-6 h-6 text-nebula-700" />
        </div>
      </div>
    </GlassCard>
  );
};

export default StatCard;