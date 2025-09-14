
import React from 'react';
import { LucideIcon, type LucideIconProps } from './LucideIcon';

export const VideoIcon: React.FC<LucideIconProps> = (props) => (
    <LucideIcon {...props}>
        <path d="m22 8-6 4 6 4V8Z" />
        <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </LucideIcon>
);
