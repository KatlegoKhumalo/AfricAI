import React from 'react';
import { LucideIcon, type LucideIconProps } from './LucideIcon';

export const AwardIcon: React.FC<LucideIconProps> = (props) => (
    <LucideIcon {...props}>
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 22 12 17 17 22 15.79 13.88" />
    </LucideIcon>
);
