import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@api/components/ui/card';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell
} from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';

const TYPE_COLORS = {
  air_quality: '#0ea5e9',
  water_quality: '#3b82f6',
  biodiversity: '#10b981',
  noise_level: '#f59e0b',
};

const SEVERITY_COLORS = { low: '#10b981', moderate: '#f59e0b', high: '#f97316', critical: '#ef4444' };

export default function ExploreCharts({ observations }) {
  // Daily trend last 14 days
  const trendData = Array.from({ length: 14 }, (_, i) => {
    const day = startOfDay(subDays(new Date(), 13 - i));
    const next = startOfDay(subDays(new Date(), 12 - i));
    const dayObs = observations.filter(o => {
      const d = new Date(o.created_date);
      return d >= day && d < next;
    });
    return {
      date: format(day, 'MMM d'),
      total: dayObs.length,
      air_quality: dayObs.filter(o => o.type === 'air_quality').length,
      water_quality: dayObs.filter(o => o.type === 'water_quality').length,
      biodiversity: dayObs.filter(o => o.type === 'biodiversity').length,
      noise_level: dayObs.filter(o => o.type === 'noise_level').length,
    };
  });

  // Type distribution
  const typeData = ['air_quality','water_quality','biodiversity','noise_level'].map(t => ({
    name: t.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
    value: observations.filter(o => o.type === t).length,
    color: TYPE_COLORS[t],
  })).filter(d => d.value > 0);

  // Severity breakdown
  const severityData = ['low','moderate','high','critical'].map(s => ({
    name: s.charAt(0).toUpperCase() + s.slice(1),
    count: observations.filter(o => o.severity === s).length,
    fill: SEVERITY_COLORS[s],
  }));

  if (observations.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center">
        <p className="text-slate-500 dark:text-slate-400 text-sm">No data matches the current filters.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {/* Trend Line */}
      <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
        <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-3">14-Day Submission Trend</p>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {Object.entries(TYPE_COLORS).map(([key, color]) => (
                <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }} />
            {Object.entries(TYPE_COLORS).map(([key, color]) => (
              <Area key={key} type="monotone" dataKey={key} stroke={color} strokeWidth={2}
                fill={`url(#grad-${key})`} name={key.replace('_',' ')} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Type Pie */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
        <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-3">Type Distribution</p>
        <ResponsiveContainer width="100%" height={120}>
          <PieChart>
            <Pie data={typeData} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value">
              {typeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-1 mt-2">
          {typeData.map(d => (
            <div key={d.name} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <span className="text-[11px] text-slate-600 dark:text-slate-400">{d.name}</span>
              </div>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{d.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Severity Bar */}
      <div className="md:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
        <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-3">Severity Breakdown</p>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={severityData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {severityData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}