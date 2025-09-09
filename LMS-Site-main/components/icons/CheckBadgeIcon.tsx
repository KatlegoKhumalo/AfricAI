import React from 'react';
import { LucideIcon, type LucideIconProps } from './LucideIcon';

export const CheckBadgeIcon: React.FC<LucideIconProps> = (props) => (
    <LucideIcon {...props} fill="currentColor" stroke="black" strokeWidth={1}>
        <path d="M3.85 8.62a4 4 0 0 1 5.17-4.69 4 4 0 0 1 5.17 4.7 4 4 0 0 1-3.31 3.31 4 4 0 0 1-5.84-1.95 4 4 0 0 1 .31-5.37Z" />
        <path d="m9 11 2 2 4-4" />
    </LucideIcon>
);