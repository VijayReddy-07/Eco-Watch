import React from 'react';
import { Input } from '@api/components/ui/input';
import { Button } from '@api/components/ui/button';
import { Badge } from '@api/components/ui/badge';
import { Search, X, Wind, Droplets, Leaf, Volume2, SlidersHorizontal } from 'lucide-react';

const TYPES = [
  { key: 'air_quality',   label: 'Air Quality',   icon: Wind,     color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300' },
  { key: 'water_quality', label: 'Water Quality', icon: Droplets, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  { key: 'biodiversity',  label: 'Biodiversity',  icon: Leaf,     color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
  { key: 'noise_level',   label: 'Noise Level',   icon: Volume2,  color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
];

const STATUSES = ['pending','validated','flagged','rejected'];
const SEVERITIES = ['low','moderate','high','critical'];

export default function ExploreFilters({ filters, onChange, resultCount }) {
  const toggle = (field, val) => {
    const cur = filters[field] || [];
    onChange({ ...filters, [field]: cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val] });
  };

  const clearAll = () => onChange({ search: '', types: [], statuses: [], severities: [], dateFrom: '', dateTo: '' });

  const activeCount = (filters.types?.length || 0) + (filters.statuses?.length || 0) + (filters.severities?.length || 0) +
    (filters.dateFrom ? 1 : 0) + (filters.dateTo ? 1 : 0);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-teal-600" />
          <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Filters</span>
          {activeCount > 0 && (
            <span className="bg-teal-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{activeCount}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">{resultCount} results</span>
          {activeCount > 0 && (
            <button onClick={clearAll} className="text-xs text-rose-500 hover:underline flex items-center gap-1">
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          value={filters.search || ''}
          onChange={e => onChange({ ...filters, search: e.target.value })}
          placeholder="Search title or description..."
          className="pl-9 dark:bg-slate-800 dark:border-slate-600 dark:text-white text-sm"
        />
      </div>

      {/* Types */}
      <div>
        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Type</p>
        <div className="flex flex-wrap gap-2">
          {TYPES.map(({ key, label, icon: Icon, color }) => {
            const active = (filters.types || []).includes(key);
            return (
              <button key={key} onClick={() => toggle('types', key)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                  active ? color + ' border-transparent shadow-sm' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-teal-300'
                }`}>
                <Icon className="w-3 h-3" /> {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status */}
      <div>
        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Status</p>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map(s => {
            const active = (filters.statuses || []).includes(s);
            return (
              <button key={s} onClick={() => toggle('statuses', s)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all capitalize ${
                  active ? 'bg-teal-600 text-white border-transparent' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-teal-300'
                }`}>{s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Severity */}
      <div>
        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Severity</p>
        <div className="flex flex-wrap gap-2">
          {SEVERITIES.map(s => {
            const active = (filters.severities || []).includes(s);
            const colors = { low: 'bg-emerald-500', moderate: 'bg-amber-500', high: 'bg-orange-500', critical: 'bg-rose-500' };
            return (
              <button key={s} onClick={() => toggle('severities', s)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all capitalize ${
                  active ? `${colors[s]} text-white border-transparent` : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-teal-300'
                }`}>{s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Range */}
      <div>
        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Date Range</p>
        <div className="flex gap-2">
          <input type="date" value={filters.dateFrom || ''} onChange={e => onChange({ ...filters, dateFrom: e.target.value })}
            className="flex-1 text-xs border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300" />
          <span className="text-slate-400 self-center text-xs">to</span>
          <input type="date" value={filters.dateTo || ''} onChange={e => onChange({ ...filters, dateTo: e.target.value })}
            className="flex-1 text-xs border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300" />
        </div>
      </div>
    </div>
  );
}