import React from 'react';
import GlassCard from '../../../components/GlassCard';

interface ChartProps {
  title: string;
  data: { name: string; [key: string]: any }[];
  dataKey: string;
}

const Chart: React.FC<ChartProps> = ({ title, data, dataKey }) => {
    const maxValue = data.length > 0 ? Math.max(...data.map(item => item[dataKey])) : 1;
    const chartHeight = 200;
    const barWidth = 40;
    const gap = 20;

    return (
        <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4">{title}</h3>
            <div className="w-full overflow-x-auto pb-4">
                 <svg width={(barWidth + gap) * data.length} height={chartHeight + 30} className="font-sans">
                    <g transform="translate(0, 10)">
                        {data.map((item, index) => {
                            const barHeight = (item[dataKey] / maxValue) * chartHeight;
                            const x = index * (barWidth + gap);
                            const y = chartHeight - barHeight;
                            return (
                                <g key={item.name}>
                                    <rect
                                        x={x}
                                        y={y}
                                        width={barWidth}
                                        height={barHeight}
                                        fill="url(#nebulaGradient)"
                                        className="transition-all"
                                        rx="4"
                                    />
                                    <text
                                        x={x + barWidth / 2}
                                        y={chartHeight + 20}
                                        textAnchor="middle"
                                        className="text-xs fill-current text-gray-400"
                                    >
                                        {item.name}
                                    </text>
                                </g>
                            );
                        })}
                    </g>
                    <defs>
                        <linearGradient id="nebulaGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#f97316" />
                            <stop offset="100%" stopColor="#dc2626" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </GlassCard>
    );
};

export default Chart;