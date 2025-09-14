
import React from 'react';
import { LucideIcon, type LucideIconProps } from './LucideIcon';

export const VideoOffIcon: React.FC<LucideIconProps> = (props) => (
    <LucideIcon {...props}>
        <path d="M16 16v-3.27l4 2.54V8.73l-4 2.54V8" />
        <path d="M2 2 22 22" />
        <path d="M14 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1" />
    </LucideIcon>
);
