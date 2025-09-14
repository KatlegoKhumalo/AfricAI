

import React from 'react';

interface StatusIndicatorProps {
    state: string;
    subtext?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ state, subtext }) => {
    return (
        <div className="text-center">
            <p className="text-lg font-semibold text-white">{state}</p>
            {subtext && <p className="text-sm text-gray-400">{subtext}</p>}
        </div>
    );
};

export default StatusIndicator;