
import React from 'react';

export interface LucideIconProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
}

export const LucideIcon: React.FC<LucideIconProps> = ({ children, size = 24, ...props }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            {children}
        </svg>
    );
};
