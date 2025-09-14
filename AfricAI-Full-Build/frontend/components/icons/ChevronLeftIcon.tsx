import React from 'react';
import { LucideIcon, type LucideIconProps } from './LucideIcon';

export const ChevronLeftIcon: React.FC<LucideIconProps> = (props) => (
    <LucideIcon {...props}>
        <path d="m15 18-6-6 6-6" />
    </LucideIcon>
);
