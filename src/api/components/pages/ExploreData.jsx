import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Button } from '@api/components/ui/button';
import { Download, Map, BarChart3, TableIcon } from 'lucide-react';
import ExploreFilters from '@api/components/explore/ExploreFilters';
import ExploreMap from '@api/components/explore/ExploreMap';
import ExploreCharts from '@api/components/explore/ExploreCharts';
import DataTable from '@api/components/explorer/DataTable';
import { isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';

const VIEWS = [
  { key: 'map',    label: 'Map',    icon: Map },
  { key: 'charts', label: 'Charts', icon: BarChart3 },
  { key: 'table',  label: 'Table',  icon: TableIcon },
];

function applyFilters(observations, filters) {
  return observations.filter(o => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!o.title?.toLowerCase().includes(q) && !o.description?.toLowerCase().includes(q)) return false;
    }
    if (filters.types?.length && !filters.types.includes(o.type)) return false;
    if (filters.statuses?.length && !filters.statuses.includes(o.status)) return false;
    if (filters.severities?.length && !filters.severities.includes(o.severity)) return false;
    if (filters.dateFrom) {
      try { if (new Date(o.created_date) < startOfDay(parseISO(filters.dateFrom))) return false; } catch {}
    }
    if (filters.dateTo) {
      try { if (new Date(o.created_date) > endOfDay(parseISO(filters.dateTo))) return false; } catch {}
    }
    return true;
  });
}

function exportCSV(observations) {
  const cols = ['id','title','type','status','severity','location_name','latitude','longitude','measurement_value','measurement_unit','created_date'];
  const rows = [cols.join(','), ...observations.map(o => cols.map(c => JSON.stringify(o[c] ?? '')).join(','))];
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'ecowatch_data.csv'; a.click();
  URL.revokeObjectURL(url);
}

export default function ExploreData() {
  const [view, setView] = useState('map');
  const [filters, setFilters] = useState({ search: '', types: [], statuses: [], severities: [], dateFrom: '', dateTo: '' });

  const { data: observations = [], isLoading } = useQuery({
    queryKey: ['observations-explore'],
    queryFn: () => base44.entities.Observation.list('-created_date', 1000),
  });

  const filtered = useMemo(() => applyFilters(observations, filters), [observations, filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Explore Data</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">Interactive map, charts, and table with advanced filters</p>
            </div>
            <div className="flex items-center gap-2">
              {/* View switcher */}
              <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 gap-1">
                {VIEWS.map(({ key, label, icon: Icon }) => (
                  <button key={key} onClick={() => setView(key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      view === key ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}>
                    <Icon className="w-4 h-4" /> {label}
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={() => exportCSV(filtered)}
                className="dark:border-slate-600 dark:text-slate-300">
                <Download className="w-4 h-4 mr-2" /> Export CSV
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid xl:grid-cols-4 gap-5">
          {/* Filters sidebar */}
          <div className="xl:col-span-1">
            <ExploreFilters filters={filters} onChange={setFilters} resultCount={filtered.length} />
          </div>

          {/* Main content */}
          <div className="xl:col-span-3 space-y-5">
            {isLoading ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl" style={{ height: 420 }}>
                <div className="flex items-center justify-center h-full">
                  <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
            ) : (
              <>
                {view === 'map' && <ExploreMap observations={filtered} />}
                {view === 'charts' && <ExploreCharts observations={filtered} />}
                {view === 'table' && <DataTable observations={filtered} />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}