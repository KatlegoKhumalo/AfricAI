import React from 'react';
import { LucideIcon, type LucideIconProps } from './LucideIcon';

export const CreditCardIcon: React.FC<LucideIconProps> = (props) => (
    <LucideIcon {...props}>
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
    </LucideIcon>
);
