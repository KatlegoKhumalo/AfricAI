import React from 'react';
import GlassCard from '../../../components/GlassCard';

interface ChartProps {
  title: string;
  data: { name: string; [key: string]: any }[];
  dataKey: string;
}

const getNiceMaxValue = (data: { [key: string]: any }[], dataKey: string) => {
    const maxVal = data.length > 0 ? Math.max(...data.map(item => item[dataKey])) : 0;
    if (maxVal === 0) return 100; // Default if no data
    const exponent = Math.floor(Math.log10(maxVal));
    const powerOf10 = Math.pow(10, exponent);
    const roundedMax = Math.ceil(maxVal / powerOf10) * powerOf10;
    return roundedMax;
};

const Chart: React.FC<ChartProps> = ({ title, data, dataKey }) => {
    const yAxisWidth = 50;
    const xAxisHeight = 30;
    const chartHeight = 200;
    const barWidth = 40;
    const gap = 20;

    const maxValue = getNiceMaxValue(data, dataKey);
    const numTicks = 5;
    const ticks = Array.from({ length: numTicks + 1 }, (_, i) => (maxValue / numTicks) * i);

    return (
        <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4">{title}</h3>
            <div className="w-full overflow-x-auto pb-4">
                 <svg width={yAxisWidth + (barWidth + gap) * data.length} height={chartHeight + xAxisHeight} className="font-sans">
                    {/* Y-axis and Grid Lines */}
                    <g className="text-gray-400 text-xs">
                        {ticks.map(tick => {
                            const y = chartHeight - (tick / maxValue) * chartHeight;
                            return (
                                <g key={tick}>
                                    <line
                                        x1={yAxisWidth}
                                        y1={y}
                                        x2={yAxisWidth + (barWidth + gap) * data.length}
                                        y2={y}
                                        stroke="currentColor"
                                        strokeDasharray="2,3"
                                        className="text-white/10"
                                    />
                                    <text x={yAxisWidth - 8} y={y + 4} textAnchor="end" fill="currentColor">
                                        {tick}
                                    </text>
                                </g>
                            );
                        })}
                    </g>

                    {/* Bars and X-axis labels */}
                    <g transform={`translate(${yAxisWidth}, 0)`}>
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
                                        y={y - 5} // Position above the bar
                                        textAnchor="middle"
                                        className="text-xs font-semibold fill-current text-white"
                                    >
                                        {item[dataKey]}
                                    </text>
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