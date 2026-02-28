import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Droplets, Leaf, Volume2, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@api/components/ui/badge';

const typeConfig = {
  air_quality:   { icon: Wind,     color: 'bg-sky-100 text-sky-700',     dot: 'bg-sky-500',     label: 'Air' },
  water_quality: { icon: Droplets, color: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500',    label: 'Water' },
  biodiversity:  { icon: Leaf,     color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', label: 'Bio' },
  noise_level:   { icon: Volume2,  color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500',   label: 'Noise' }
};

const severityBadge = {
  low:      'bg-emerald-100 text-emerald-700',
  moderate: 'bg-amber-100 text-amber-700',
  high:     'bg-orange-100 text-orange-700',
  critical: 'bg-rose-100 text-rose-700'
};

export default function CommunityFeed({ observations, newIds = [] }) {
  const sorted = [...observations].sort((a, b) => new Date(b.created_date) - new Date(a.created_date)).slice(0, 20);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-teal-500" />
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Live Community Feed</h3>
        </div>
        {newIds.length > 0 && (
          <span className="text-xs bg-rose-500 text-white rounded-full px-2 py-0.5 font-bold animate-pulse">
            {newIds.length} new
          </span>
        )}
      </div>

      <div className="overflow-y-auto flex-1 divide-y divide-slate-50 dark:divide-slate-800">
        <AnimatePresence initial={false}>
          {sorted.map((obs) => {
            const cfg = typeConfig[obs.type] || typeConfig.air_quality;
            const Icon = cfg.icon;
            const isNew = newIds.includes(obs.id);
            return (
              <motion.div
                key={obs.id}
                initial={{ opacity: 0, x: 20, backgroundColor: isNew ? '#ecfdf5' : '#ffffff' }}
                animate={{ opacity: 1, x: 0, backgroundColor: '#ffffff' }}
                transition={{ duration: 0.4 }}
                className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${isNew ? 'border-l-2 border-teal-400' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-lg flex-shrink-0 ${cfg.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{obs.title}</p>
                      {isNew && <span className="text-[9px] bg-teal-500 text-white rounded px-1 font-bold">NEW</span>}
                    </div>
                    {obs.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{obs.description}</p>
                    )}
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <Badge className={`text-[10px] px-1.5 py-0 ${severityBadge[obs.severity] || ''}`}>{obs.severity}</Badge>
                      {obs.status === 'validated' && <CheckCircle className="w-3 h-3 text-emerald-500" />}
                      {obs.status === 'flagged' && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                      {obs.measurement_value != null && (
                        <span className="text-[10px] text-slate-500 font-mono">{obs.measurement_value} {obs.measurement_unit}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-2.5 h-2.5 text-slate-400" />
                      <span className="text-[10px] text-slate-400">
                        {obs.created_date ? formatDistanceToNow(new Date(obs.created_date), { addSuffix: true }) : ''}
                      </span>
                      {obs.location_name && (
                        <span className="text-[10px] text-slate-400 ml-1">· 📍 {obs.location_name}</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {sorted.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Leaf className="w-8 h-8 mb-2 opacity-30" />
            <p className="text-sm">No observations yet</p>
          </div>
        )}
      </div>
    </div>
  );
}