import React from 'react';
import GlassCard from '../../../components/GlassCard';

interface MapChartProps {
  title: string;
}

const MapChart: React.FC<MapChartProps> = ({ title }) => {
  return (
    <GlassCard className="p-6">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="h-80 bg-gray-800/50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">World Map Visualization would be here.</p>
          {/* In a real app, this would be a library like D3, react-simple-maps, or another charting library */}
      </div>
    </GlassCard>
  );
};

export default MapChart;
