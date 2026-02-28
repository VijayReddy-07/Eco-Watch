import React from 'react';
import { motion } from 'framer-motion';
import { Target, Wind, Droplets, Leaf, Brain, BarChart3, Share2, CheckCircle2 } from 'lucide-react';

const GOAL = 10000;

const pillars = [
  { icon: Wind, label: 'Air Quality', desc: 'PM2.5, AQI & pollutant readings', color: 'text-sky-500', bg: 'bg-sky-50' },
  { icon: Droplets, label: 'Water Samples', desc: 'pH, turbidity & contaminants', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: Leaf, label: 'Biodiversity', desc: 'Species sightings & habitat data', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { icon: Brain, label: 'ML Validation', desc: 'Outlier detection & confidence scoring', color: 'text-violet-500', bg: 'bg-violet-50' },
  { icon: BarChart3, label: 'Public Dashboards', desc: 'Open visualizations & trend maps', color: 'text-teal-500', bg: 'bg-teal-50' },
  { icon: Share2, label: 'Open API', desc: 'Share datasets with researchers', color: 'text-amber-500', bg: 'bg-amber-50' }
];

export default function MissionProgress({ total }) {
  const pct = Math.min(Math.round((total / GOAL) * 100), 100);
  const remaining = Math.max(GOAL - total, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 text-white mb-8 shadow-lg shadow-teal-500/20"
    >
      {/* Top row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">Year-One Mission: 10,000 Observations</h2>
            <p className="text-teal-100 text-sm">Aggregate · Validate · Visualize · Share</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-3xl font-extrabold">{pct}%</p>
          <p className="text-teal-200 text-xs">{remaining.toLocaleString()} remaining</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white/20 rounded-full h-3 mb-1 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="h-full rounded-full bg-white"
        />
      </div>
      <div className="flex justify-between text-xs text-teal-200 mb-6">
        <span>{total.toLocaleString()} collected</span>
        <span>Goal: {GOAL.toLocaleString()}</span>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {pillars.map(({ icon: Icon, label, desc, color, bg }) => (
          <div key={label} className="bg-white/10 hover:bg-white/20 transition-colors rounded-xl p-3 text-center">
            <div className={`w-8 h-8 rounded-lg ${bg} ${color} flex items-center justify-center mx-auto mb-2`}>
              <Icon className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold leading-tight mb-0.5">{label}</p>
            <p className="text-[10px] text-teal-200 leading-tight hidden sm:block">{desc}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}