
import React from 'react';
import { LucideIcon, type LucideIconProps } from './LucideIcon';

export const PlusCircleIcon: React.FC<LucideIconProps> = (props) => (
    <LucideIcon {...props}>
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8" />
        <path d="M12 8v8" />
    </LucideIcon>
);
