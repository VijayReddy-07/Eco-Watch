import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Trash2, ToggleLeft, ToggleRight, Wind, Droplets, Leaf, Volume2, Bell, Mail, Plus, Loader2 } from 'lucide-react';
import { Button } from '@api/components/ui/button';
import { Badge } from '@api/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import LocationAlertForm from './LocationAlertForm';

const TYPE_ICONS = { air_quality: Wind, water_quality: Droplets, biodiversity: Leaf, noise_level: Volume2 };
const SEV_COLORS = { low: 'bg-emerald-100 text-emerald-700', moderate: 'bg-amber-100 text-amber-700', high: 'bg-orange-100 text-orange-700', critical: 'bg-rose-100 text-rose-700' };

export default function LocationAlertsList({ locationAlerts, userEmail, queryKey }) {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const deleteZone = async (id) => {
    setDeletingId(id);
    await base44.entities.LocationAlert.delete(id);
    qc.invalidateQueries({ queryKey });
    setDeletingId(null);
  };

  const toggleActive = async (zone) => {
    await base44.entities.LocationAlert.update(zone.id, { is_active: !zone.is_active });
    qc.invalidateQueries({ queryKey });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-500" /> Location Alert Zones
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Get notified when observations appear in your areas of interest</p>
        </div>
        <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={() => setShowForm(v => !v)}>
          <Plus className="w-4 h-4 mr-1" /> Add Zone
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 overflow-hidden">
            <LocationAlertForm userEmail={userEmail} onSaved={() => { setShowForm(false); qc.invalidateQueries({ queryKey }); }} onCancel={() => setShowForm(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {locationAlerts.length === 0 && !showForm ? (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          <MapPin className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No location zones set up yet.</p>
          <p className="text-xs mt-1">Add a zone to get notified about activity in specific areas.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {locationAlerts.map(zone => (
            <motion.div key={zone.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={`border rounded-xl p-3 transition-all ${zone.is_active ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700' : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700 opacity-60'}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className={`mt-0.5 p-1.5 rounded-lg flex-shrink-0 ${zone.is_active ? 'bg-teal-100 dark:bg-teal-900/40' : 'bg-slate-100 dark:bg-slate-800'}`}>
                    <MapPin className={`w-3.5 h-3.5 ${zone.is_active ? 'text-teal-600' : 'text-slate-400'}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-900 dark:text-white">{zone.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {zone.location_label || `${zone.center_lat?.toFixed(3)}, ${zone.center_lng?.toFixed(3)}`} · {zone.radius_km}km radius
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {(zone.observation_types || []).map(t => {
                        const Icon = TYPE_ICONS[t] || MapPin;
                        return <span key={t} className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full"><Icon className="w-2.5 h-2.5" />{t.replace('_',' ')}</span>;
                      })}
                      {(zone.severities || []).map(s => (
                        <span key={s} className={`text-[10px] px-1.5 py-0.5 rounded-full capitalize ${SEV_COLORS[s] || 'bg-slate-100 text-slate-600'}`}>{s}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      {zone.notify_inapp && <span className="flex items-center gap-0.5 text-[10px] text-teal-600 dark:text-teal-400"><Bell className="w-2.5 h-2.5" /> In-app</span>}
                      {zone.notify_email && <span className="flex items-center gap-0.5 text-[10px] text-blue-600 dark:text-blue-400"><Mail className="w-2.5 h-2.5" /> Email</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => toggleActive(zone)} title={zone.is_active ? 'Disable' : 'Enable'}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    {zone.is_active
                      ? <ToggleRight className="w-4 h-4 text-teal-500" />
                      : <ToggleLeft className="w-4 h-4 text-slate-400" />}
                  </button>
                  <button onClick={() => deleteZone(zone.id)} disabled={deletingId === zone.id}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors">
                    {deletingId === zone.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}