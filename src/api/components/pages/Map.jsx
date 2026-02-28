import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import ObservationMap from '@api/components/map/ObservationMap';
import CommunityFeed from '@api/components/map/CommunityFeed';
import AIAnalysisSummary from '@api/components/map/AIAnalysisSummary';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@api/components/ui/select';
import { Badge } from '@api/components/ui/badge';
import { Button } from '@api/components/ui/button';
import {
  Wind, Droplets, Leaf, Volume2, Filter, AlertTriangle,
  Radio, LayoutGrid, Map as MapIcon, List, RefreshCw,
  Trash2, FlaskConical, Sun, Activity, HelpCircle
} from 'lucide-react';
import { Skeleton } from '@api/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { generateDummyObservations } from '@/api/constants/dummyData';

const INDIA_CENTER = [20.5937, 78.9629];

const typeMeta = [
  { type: 'air_quality', label: 'Air Quality', icon: Wind, color: 'bg-sky-50 border-sky-200 text-sky-700', dot: 'bg-sky-500' },
  { type: 'water_quality', label: 'Water Quality', icon: Droplets, color: 'bg-blue-50 border-blue-200 text-blue-700', dot: 'bg-blue-500' },
  { type: 'biodiversity', label: 'Biodiversity', icon: Leaf, color: 'bg-emerald-50 border-emerald-200 text-emerald-700', dot: 'bg-emerald-500' },
  { type: 'noise_level', label: 'Noise Level', icon: Volume2, color: 'bg-amber-50 border-amber-200 text-amber-700', dot: 'bg-amber-500' },
  { type: 'waste', label: 'Waste', icon: Trash2, color: 'bg-orange-50 border-orange-200 text-orange-700', dot: 'bg-orange-500' },
  { type: 'soil_quality', label: 'Soil Quality', icon: FlaskConical, color: 'bg-stone-50 border-stone-200 text-stone-700', dot: 'bg-stone-500' },
  { type: 'weather', label: 'Weather', icon: Sun, color: 'bg-yellow-50 border-yellow-200 text-yellow-700', dot: 'bg-yellow-500' },
  { type: 'radiation', label: 'Radiation', icon: Activity, color: 'bg-rose-50 border-rose-200 text-rose-700', dot: 'bg-rose-500' },
  { type: 'custom', label: 'Custom', icon: HelpCircle, color: 'bg-slate-50 border-slate-200 text-slate-700', dot: 'bg-slate-500' }
];

export default function Map() {
  const [observations, setObservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [newIds, setNewIds] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [view, setView] = useState('split'); // 'map', 'split', 'feed'

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await base44.entities.Observation.list('-created_date', 500);
        if (data && data.length > 0) {
          setObservations(data);
          console.log('Loaded from API:', data.length, 'observations');
        } else {
          // Use dummy data if no API data
          const dummyData = generateDummyObservations();
          setObservations(dummyData);
          console.log('Using dummy data:', dummyData.length, 'observations');
        }
      } catch (error) {
        console.error('Error loading observations:', error);
        // Use dummy data on error
        const dummyData = generateDummyObservations();
        setObservations(dummyData);
        console.log('Error occurred, using dummy data:', dummyData.length, 'observations');
      }
      setIsLoading(false);
      setLastUpdate(new Date());
    };
    loadData();
  }, []);

  // Real-time subscription
  useEffect(() => {
    const unsub = base44.entities.Observation.subscribe((event) => {
      if (event.type === 'create') {
        setObservations(prev => [event.data, ...prev]);
        setNewIds(prev => [...prev, event.id]);
        setLastUpdate(new Date());
        // Clear "new" badge after 30s
        setTimeout(() => setNewIds(prev => prev.filter(id => id !== event.id)), 30000);
      } else if (event.type === 'update') {
        setObservations(prev => prev.map(o => o.id === event.id ? event.data : o));
        setLastUpdate(new Date());
      } else if (event.type === 'delete') {
        setObservations(prev => prev.filter(o => o.id !== event.id));
      }
    });
    return unsub;
  }, []);

  const filteredObservations = useMemo(() => {
    return observations.filter(obs => {
      const matchesType = typeFilter === 'all' || obs.type === typeFilter;
      const matchesSeverity = severityFilter === 'all' || obs.severity === severityFilter;
      const matchesStatus = statusFilter === 'all' || obs.status === statusFilter;
      return matchesType && matchesSeverity && matchesStatus && obs.latitude && obs.longitude;
    });
  }, [observations, typeFilter, severityFilter, statusFilter]);

  // Log observation counts for debugging
  useEffect(() => {
    if (observations.length > 0) {
      const counts = {
        total: observations.length,
        air_quality: observations.filter(o => o.type === 'air_quality').length,
        water_quality: observations.filter(o => o.type === 'water_quality').length,
        biodiversity: observations.filter(o => o.type === 'biodiversity').length,
        noise_level: observations.filter(o => o.type === 'noise_level').length,
        filtered: filteredObservations.length
      };
      console.log('Observation counts:', counts);
    }
  }, [observations, filteredObservations]);

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    const loadData = async () => {
      try {
        const data = await base44.entities.Observation.list('-created_date', 500);
        if (data && data.length > 0) {
          setObservations(data);
        } else {
          // Use dummy data if no API data
          setObservations(generateDummyObservations());
        }
      } catch (error) {
        console.error('Error loading observations:', error);
        // Use dummy data on error
        setObservations(generateDummyObservations());
      }
      setIsLoading(false);
      setLastUpdate(new Date());
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950/20">
      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MapIcon className="w-6 h-6 text-teal-500" /> India Environmental Map
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <Radio className="w-3 h-3 animate-pulse" /> Live
                </span>
                {lastUpdate && (
                  <span className="text-xs text-slate-400">
                    Updated {formatDistanceToNow(lastUpdate, { addSuffix: true })}
                  </span>
                )}
                {newIds.length > 0 && (
                  <span className="text-xs bg-rose-500 text-white rounded-full px-2 py-0.5 font-bold animate-pulse">
                    {newIds.length} new
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* View toggle */}
              <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                {[
                  { id: 'map', icon: MapIcon, label: 'Map' },
                  { id: 'split', icon: LayoutGrid, label: 'Split' },
                  { id: 'feed', icon: List, label: 'Feed' }
                ].map(v => (
                  <button key={v.id} onClick={() => setView(v.id)}
                    className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1 transition-colors ${view === v.id
                      ? 'bg-teal-500 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}>
                    <v.icon className="w-3.5 h-3.5" /> {v.label}
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-1 text-xs h-8">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Analysis cards */}
        {!isLoading && (
          <div className="flex flex-wrap gap-3 mb-4">
            {typeMeta.map(({ type, label, icon: Icon, color, dot }) => {
              const items = observations.filter(o => o.type === type);
              const critical = items.filter(o => o.severity === 'critical').length;
              const high = items.filter(o => o.severity === 'high').length;
              const validated = items.filter(o => o.status === 'validated').length;
              return (
                <motion.div
                  key={type}
                  whileHover={{ scale: 1.02 }}
                  className={`rounded-xl border p-3 cursor-pointer transition-all ${color} ${typeFilter === type ? 'ring-2 ring-offset-1 ring-current shadow-md' : 'hover:shadow-md'}`}
                  onClick={() => setTypeFilter(typeFilter === type ? 'all' : type)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Icon className="w-4 h-4" />
                    {(critical + high) > 0 && (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-rose-600">
                        <AlertTriangle className="w-3 h-3" />{critical + high}
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold">{items.length}</p>
                  <p className="text-xs font-medium opacity-80">{label}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <div className="flex-1 bg-white/50 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${dot}`} style={{ width: items.length > 0 ? `${(validated / items.length) * 100}%` : '0%' }} />
                    </div>
                    <span className="text-[9px] opacity-70">{validated} ✓</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-3 mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filters:</span>
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px] h-8 text-xs">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {typeMeta.map(t => (
                  <SelectItem key={t.type} value={t.type}>
                    <div className="flex items-center gap-2"><t.icon className="w-3.5 h-3.5" />{t.label}</div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue placeholder="All Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="low"><Badge className="bg-emerald-100 text-emerald-700">Low</Badge></SelectItem>
                <SelectItem value="moderate"><Badge className="bg-amber-100 text-amber-700">Moderate</Badge></SelectItem>
                <SelectItem value="high"><Badge className="bg-orange-100 text-orange-700">High</Badge></SelectItem>
                <SelectItem value="critical"><Badge className="bg-rose-100 text-rose-700">Critical</Badge></SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="validated">Validated</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Badge variant="outline" className="ml-auto text-slate-600 dark:text-slate-300">
              {filteredObservations.length} showing
            </Badge>

            {(typeFilter !== 'all' || severityFilter !== 'all' || statusFilter !== 'all') && (
              <Button variant="ghost" size="sm" className="text-xs h-7 text-slate-500"
                onClick={() => { setTypeFilter('all'); setSeverityFilter('all'); setStatusFilter('all'); }}>
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {/* Main content area */}
        {isLoading ? (
          <Skeleton className="h-[600px] rounded-2xl" />
        ) : (
          <div className={`gap-4 ${view === 'split' ? 'grid lg:grid-cols-3' : view === 'map' ? '' : 'grid lg:grid-cols-2'}`}>
            {/* Map */}
            {(view === 'map' || view === 'split') && (
              <div className={`rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm ${view === 'split' ? 'lg:col-span-2 h-[650px]' : 'h-[700px]'}`}>
                <ObservationMap
                  observations={filteredObservations}
                  center={INDIA_CENTER}
                  zoom={5}
                  newIds={newIds}
                />
              </div>
            )}

            {/* Right panel */}
            {view === 'split' && (
              <div className="flex flex-col gap-4 h-[650px]">
                <div className="flex-1 min-h-0">
                  <CommunityFeed observations={observations} newIds={newIds} />
                </div>
                <AIAnalysisSummary observations={observations} />
              </div>
            )}

            {/* Feed-only view */}
            {view === 'feed' && (
              <>
                <div className="h-[650px]">
                  <CommunityFeed observations={observations} newIds={newIds} />
                </div>
                <div>
                  <AIAnalysisSummary observations={observations} />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}