import { useState, useEffect } from 'react';

export const useDynamicGrid = (participantCount: number) => {
    const [grid, setGrid] = useState({ cols: 1, rows: 1 });

    useEffect(() => {
        const calculateGrid = () => {
            if (participantCount === 0) {
                return { cols: 1, rows: 1 };
            }
            const cols = Math.ceil(Math.sqrt(participantCount));
            const rows = Math.ceil(participantCount / cols);
            return { cols, rows };
        };
        
        const updateGrid = () => {
            setGrid(calculateGrid());
        };

        updateGrid();
        
        window.addEventListener('resize', updateGrid);
        return () => window.removeEventListener('resize', updateGrid);
    }, [participantCount]);

    return grid;
};
