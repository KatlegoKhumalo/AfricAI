import React from 'react';
import { LucideIcon, type LucideIconProps } from './LucideIcon';

export const UnderlineIcon: React.FC<LucideIconProps> = (props) => (
    <LucideIcon {...props}>
        <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
        <line x1="4" y1="21" x2="20" y2="21" />
    </LucideIcon>
);
