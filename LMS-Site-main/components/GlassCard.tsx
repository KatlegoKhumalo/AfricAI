import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className }) => {
  const combinedClasses = `bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg transition-all duration-300 hover:border-nebula-600/80 ${className || ''}`;
  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
};

export default GlassCard;