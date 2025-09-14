
import React from 'react';
import { LucideIcon, type LucideIconProps } from './LucideIcon';

export const SpeakerOffIcon: React.FC<LucideIconProps> = (props) => (
    <LucideIcon {...props}>
        <path d="M11 5 6 9H2v6h4l5 4V5z" />
        <line x1="22" y1="9" x2="16" y2="15" />
        <line x1="16" y1="9" x2="22" y2="15" />
    </LucideIcon>
);
