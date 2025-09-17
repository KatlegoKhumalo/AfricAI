import React from 'react';

interface LogoProps {
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
    return (
        <img 
            src="/assets/images/logo.png"
            alt="AfricAI Logo"
            className={className}
        />
    );
};

export default Logo;