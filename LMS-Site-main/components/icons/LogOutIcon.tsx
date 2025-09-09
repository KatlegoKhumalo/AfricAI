import React from 'react';
import { LucideIcon, type LucideIconProps } from './LucideIcon';

export const LogOutIcon: React.FC<LucideIconProps> = (props) => (
    <LucideIcon {...props}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" x2="9" y1="12" y2="12" />
    </LucideIcon>
);
