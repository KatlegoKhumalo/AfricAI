import React from 'react';
import { LucideIcon, type LucideIconProps } from './LucideIcon';

export const BarChartIcon: React.FC<LucideIconProps> = (props) => (
    <LucideIcon {...props}>
        <line x1="12" x2="12" y1="20" y2="10" />
        <line x1="18" x2="18" y1="20" y2="4" />
        <line x1="6" x2="6" y1="20" y2="16" />
    </LucideIcon>
);
