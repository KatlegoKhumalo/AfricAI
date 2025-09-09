import React from 'react';
import GlassCard from '../../../components/GlassCard';

interface PieChartProps {
  title: string;
  data: { name: string; value: number }[];
}

const COLORS = ['#f97316', '#dc2626', '#ea580c', '#c2410c'];

const PieChart: React.FC<PieChartProps> = ({ title, data }) => {
    const total = data.reduce((acc, entry) => acc + entry.value, 0);
    let cumulative = 0;

    return (
        <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4">{title}</h3>
            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative w-48 h-48">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                        {data.map((entry, index) => {
                            const percentage = (entry.value / total) * 100;
                            const dashArray = `${percentage} ${100 - percentage}`;
                            const dashOffset = -cumulative;
                            cumulative += percentage;
                            return (
                                <circle
                                    key={entry.name}
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="transparent"
                                    stroke={COLORS[index % COLORS.length]}
                                    strokeWidth="10"
                                    strokeDasharray={dashArray}
                                    strokeDashoffset={dashOffset}
                                />
                            );
                        })}
                    </svg>
                </div>
                <div className="flex-1">
                    <ul className="space-y-2">
                        {data.map((entry, index) => (
                            <li key={entry.name} className="flex items-center text-sm">
                                <span className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                <span className="text-gray-300">{entry.name}</span>
                                <span className="ml-auto font-semibold">{((entry.value / total) * 100).toFixed(1)}%</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </GlassCard>
    );
};

export default PieChart;
