import React from 'react';
import GlassCard from '../../../components/GlassCard';

interface TableProps {
  title: string;
  headers: string[];
  data: (string | number | React.ReactNode)[][];
}

const Table: React.FC<TableProps> = ({ title, headers, data }) => {
  return (
    <GlassCard className="p-6">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10">
              {headers.map((header) => (
                <th key={header} className="p-4 text-sm font-semibold text-gray-400">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-white/10 last:border-b-0 hover:bg-white/5">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="p-4 text-sm">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};

export default Table;
