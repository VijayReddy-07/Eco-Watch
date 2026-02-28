import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../ui/badge';
import { Wind, Droplets, Leaf, Volume2, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';

const typeIcons = {
  air_quality: Wind,
  water_quality: Droplets,
  biodiversity: Leaf,
  noise_level: Volume2
};

const typeColors = {
  air_quality: "bg-sky-100 text-sky-700",
  water_quality: "bg-blue-100 text-blue-700",
  biodiversity: "bg-emerald-100 text-emerald-700",
  noise_level: "bg-amber-100 text-amber-700"
};

const statusColors = {
  pending: "bg-slate-100 text-slate-700",
  validated: "bg-emerald-100 text-emerald-700",
  flagged: "bg-amber-100 text-amber-700",
  rejected: "bg-rose-100 text-rose-700"
};

const severityColors = {
  low: "bg-emerald-500",
  moderate: "bg-amber-500",
  high: "bg-orange-500",
  critical: "bg-rose-500"
};

export default function RecentObservations({ observations }) {
  if (!observations?.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <p className="text-center text-slate-500">No observations yet. Be the first to contribute!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-lg font-semibold text-slate-900">Recent Observations</h3>
        <p className="text-sm text-slate-500 mt-1">Latest citizen science submissions</p>
      </div>
      <div className="divide-y divide-slate-100">
        {observations.slice(0, 5).map((obs, index) => {
          const Icon = typeIcons[obs.type] || Wind;
          return (
            <motion.div
              key={obs.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-xl ${typeColors[obs.type]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-slate-900 truncate">{obs.title}</h4>
                    <div className={`w-2 h-2 rounded-full ${severityColors[obs.severity]}`} />
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {obs.location_name || 'Unknown location'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {format(new Date(obs.created_date), 'MMM d, h:mm a')}
                    </span>
                  </div>
                </div>
                <Badge className={statusColors[obs.status]}>
                  {obs.status}
                </Badge>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}