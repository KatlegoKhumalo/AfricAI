import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', size = 'md', ...props }) => {
  // FIX: Add size prop to control button padding and text size, resolving type errors.
  const baseClasses = 'rounded-md font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed shadow-lg';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-nebula-700 to-nebula-600 hover:from-nebula-600 hover:to-nebula-500 text-white focus:ring-nebula-500',
    secondary: 'bg-gray-700/50 hover:bg-gray-700/80 text-white focus:ring-gray-500',
    ghost: 'bg-transparent hover:bg-white/10 text-white focus:ring-white',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5',
    lg: 'px-8 py-3 text-lg'
  };

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className || ''}`;

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
