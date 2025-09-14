import React from 'react';

interface PillProps {
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'green' | 'yellow' | 'red';
  className?: string;
}

const Pill: React.FC<PillProps> = ({ children, color = 'secondary', className }) => {
  const colorClasses = {
    primary: 'bg-nebula-600/20 text-nebula-400',
    secondary: 'bg-gray-500/20 text-gray-300',
    green: 'bg-green-500/20 text-green-300',
    yellow: 'bg-yellow-500/20 text-yellow-300',
    red: 'bg-red-500/20 text-red-300',
  };

  const combinedClasses = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]} ${className || ''}`;

  return <span className={combinedClasses}>{children}</span>;
};

export default Pill;
