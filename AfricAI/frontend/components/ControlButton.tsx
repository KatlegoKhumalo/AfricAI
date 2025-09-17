import React from 'react';

interface ControlButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  label: string;
  isActive?: boolean;
  variant?: 'primary' | 'danger';
}

const ControlButton: React.FC<ControlButtonProps> = ({ onClick, children, label, isActive, variant = 'primary' }) => {
  const baseClasses = 'flex flex-col items-center justify-center w-20 h-20 rounded-lg transition-colors duration-200';
  
  const variantClasses = {
    primary: isActive ? 'bg-gray-600' : 'bg-gray-700/80 hover:bg-gray-700',
    danger: 'bg-red-600 hover:bg-red-500'
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]}`;

  return (
    <div className="flex flex-col items-center gap-1 text-center">
        <button onClick={onClick} className={combinedClasses}>
            {children}
        </button>
        <span className="text-xs text-gray-300">{label}</span>
    </div>
  );
};

export default ControlButton;
