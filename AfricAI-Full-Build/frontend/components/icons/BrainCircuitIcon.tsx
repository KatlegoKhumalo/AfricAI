import React from 'react';
import { LucideIcon, type LucideIconProps } from './LucideIcon';

export const BrainCircuitIcon: React.FC<LucideIconProps> = (props) => (
    <LucideIcon {...props}>
        <path d="M12 2a2.5 2.5 0 0 1 3 4" />
        <path d="M12 2a2.5 2.5 0 0 0-3 4" />
        <path d="M12 15a2.5 2.5 0 0 1 3 4" />
        <path d="M12 15a2.5 2.5 0 0 0-3 4" />
        <path d="M12 8a2.5 2.5 0 0 1 3 4" />
        <path d="M12 8a2.5 2.5 0 0 0-3 4" />
        <path d="M5 12a2.5 2.5 0 0 1 3-4" />
        <path d="M5 12a2.5 2.5 0 0 0 3-4" />
        <path d="M19 12a2.5 2.5 0 0 1-3-4" />
        <path d="M19 12a2.5 2.5 0 0 0-3-4" />
        <path d="M12 22v-3" />
        <path d="M12 5V2" />
        <path d="M12 15v-3" />
        <path d="m4.2 4.2 1.4 1.4" />
        <path d="M18.4 18.4 17 17" />
        <path d="m4.2 19.8 1.4-1.4" />
        <path d="M18.4 5.6 17 7" />
    </LucideIcon>
);