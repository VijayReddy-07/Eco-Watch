import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Wind, Droplets, Leaf, Volume2 } from 'lucide-react';

const typeConfig = {
  air_quality: { label: 'Air Quality', color: '#0EA5E9', icon: Wind },
  water_quality: { label: 'Water Quality', color: '#3B82F6', icon: Droplets },
  biodiversity: { label: 'Biodiversity', color: '#10B981', icon: Leaf },
  noise_level: { label: 'Noise Level', color: '#F59E0B', icon: Volume2 }
};

export default function TypeDistribution({ observations }) {
  const typeData = Object.entries(typeConfig).map(([type, config]) => ({
    name: config.label,
    value: observations?.filter(o => o.type === type).length || 0,
    color: config.color,
    icon: config.icon
  })).filter(d => d.value > 0);

  const total = typeData.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Data Distribution</h3>
        <p className="text-center text-slate-500 py-8">No data to display</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Data Distribution</h3>
        <p className="text-sm text-slate-500 mt-1">Observations by type</p>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={typeData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {typeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #E2E8F0',
                borderRadius: '12px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        {typeData.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-slate-600 truncate">{item.name}</span>
              <span className="text-sm font-medium text-slate-900 ml-auto">{item.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}