import React from 'react';
import { LucideIcon, type LucideIconProps } from './LucideIcon';

export const DollarSignIcon: React.FC<LucideIconProps> = (props) => (
    <LucideIcon {...props}>
        <line x1="12" x2="12" y1="2" y2="22" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </LucideIcon>
);
