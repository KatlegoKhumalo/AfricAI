import React from 'react';
import { LucideIcon, type LucideIconProps } from './LucideIcon';

export const ReceiptIcon: React.FC<LucideIconProps> = (props) => (
    <LucideIcon {...props}>
        <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
        <path d="M16 8h-6a2 2 0 1 0 0 4h6" />
        <path d="M12 14v-4" />
    </LucideIcon>
);