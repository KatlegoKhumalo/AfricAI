
import React from 'react';
import { LucideIcon, type LucideIconProps } from './LucideIcon';

export const MicOffIcon: React.FC<LucideIconProps> = (props) => (
    <LucideIcon {...props}>
        <line x1="2" y1="2" x2="22" y2="22" />
        <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" />
        <path d="M5 10v2a7 7 0 0 0 12 5" />
        <path d="M12 1a3 3 0 0 0-3 3v7" />
        <line x1="12" x2="12" y1="19" y2="22" />
    </LucideIcon>
);
