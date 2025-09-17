import React from 'react';
import GlassCard from '../../../components/GlassCard';

interface MapChartProps {
  title: string;
}

const MapChart: React.FC<MapChartProps> = ({ title }) => {
  return (
    <GlassCard className="p-6 flex flex-col h-full">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="flex-grow h-80 bg-gray-800/50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">World Map Visualization would be here.</p>
          {/* In a real app, this would be a library like D3, react-simple-maps, or another charting library */}
      </div>
      <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-400">
        <span>Low</span>
        <div className="w-32 h-4 rounded-full bg-gradient-to-r from-green-900/50 via-yellow-800/50 to-red-700/50 border border-white/10"></div>
        <span>High</span>
      </div>
    </GlassCard>
  );
};

export default MapChart;