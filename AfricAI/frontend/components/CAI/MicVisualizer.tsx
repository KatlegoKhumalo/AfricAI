

import React from 'react';
import { MicIcon } from '../icons/MicIcon';

const MicVisualizer: React.FC = () => {
    return (
        <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 bg-nebula-600/50 rounded-full animate-pulse"></div>
            <div className="relative w-16 h-16 bg-nebula-600 rounded-full flex items-center justify-center">
                <MicIcon className="w-8 h-8 text-white" />
            </div>
        </div>
    );
};

export default MicVisualizer;