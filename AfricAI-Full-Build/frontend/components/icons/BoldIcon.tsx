import React from 'react';
import { LucideIcon, type LucideIconProps } from './LucideIcon';

export const BoldIcon: React.FC<LucideIconProps> = (props) => (
    <LucideIcon {...props}>
        <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
        <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    </LucideIcon>
);
