
import React from 'react';
import { LucideIcon, type LucideIconProps } from './LucideIcon';

export const ScreenShareIcon: React.FC<LucideIconProps> = (props) => (
    <LucideIcon {...props}>
        <path d="M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3" />
        <path d="m22 7-5 5" />
        <path d="M17 7h5v5" />
    </LucideIcon>
);
