
import React from 'react';
import { LucideIcon, type LucideIconProps } from './LucideIcon';

export const SearchIcon: React.FC<LucideIconProps> = (props) => (
    <LucideIcon {...props}>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
    </LucideIcon>
);
