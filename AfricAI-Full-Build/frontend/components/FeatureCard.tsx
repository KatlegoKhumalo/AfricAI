import React from 'react';
import GlassCard from './GlassCard';
import { LucideIconProps } from './icons/LucideIcon';

interface FeatureCardProps {
  icon: React.FC<LucideIconProps>;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <GlassCard className="p-8 text-center flex flex-col items-center">
      <div className="bg-nebula-600/20 p-4 rounded-full mb-6">
          <Icon className="w-8 h-8 text-nebula-600" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </GlassCard>
  );
};

export default FeatureCard;