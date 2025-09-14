
import React from 'react';
import { LucideIcon, type LucideIconProps } from './LucideIcon';

export const LayoutDashboardIcon: React.FC<LucideIconProps> = (props) => (
    <LucideIcon {...props}>
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
    </LucideIcon>
);
