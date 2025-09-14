import React from 'react';
import { LucideIcon, type LucideIconProps } from './LucideIcon';

export const XCircleIcon: React.FC<LucideIconProps> = (props) => (
    <LucideIcon {...props}>
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
    </LucideIcon>
);
