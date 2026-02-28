import React, { useState } from 'react';
import { Button } from '@api/components/ui/button';
import { Input } from '@api/components/ui/input';
import { Label } from '@api/components/ui/label';
import { Switch } from '@api/components/ui/switch';
import { MapPin, Wind, Droplets, Leaf, Volume2, AlertTriangle, Save, X, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const OBS_TYPES = [
  { key: 'air_quality',   label: 'Air Quality',   icon: Wind,     color: 'text-sky-600' },
  { key: 'water_quality', label: 'Water Quality', icon: Droplets, color: 'text-blue-600' },
  { key: 'biodiversity',  label: 'Biodiversity',  icon: Leaf,     color: 'text-emerald-600' },
  { key: 'noise_level',   label: 'Noise Level',   icon: Volume2,  color: 'text-amber-600' },
];

const SEVERITIES = [
  { key: 'low',      color: 'bg-emerald-500' },
  { key: 'moderate', color: 'bg-amber-500' },
  { key: 'high',     color: 'bg-orange-500' },
  { key: 'critical', color: 'bg-rose-500' },
];

const REGIONS = [
  { label: 'London, UK', lat: 51.5074, lng: -0.1278 },
  { label: 'New York, US', lat: 40.7128, lng: -74.0060 },
  { label: 'Paris, France', lat: 48.8566, lng: 2.3522 },
  { label: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
  { label: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
  { label: 'Berlin, Germany', lat: 52.5200, lng: 13.4050 },
];

export default function LocationAlertForm({ userEmail, onSaved, onCancel }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    location_label: '',
    center_lat: '',
    center_lng: '',
    radius_km: 10,
    observation_types: ['air_quality','water_quality','biodiversity','noise_level'],
    severities: ['high','critical'],
    notify_inapp: true,
    notify_email: false,
    is_active: true,
  });

  const toggleArr = (field, val) => {
    const cur = form[field] || [];
    setForm(p => ({ ...p, [field]: cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val] }));
  };

  const applyRegion = (region) => {
    setForm(p => ({ ...p, location_label: region.label, center_lat: region.lat, center_lng: region.lng }));
  };

  const save = async () => {
    if (!form.name || !form.center_lat || !form.center_lng) return;
    setSaving(true);
    await base44.entities.LocationAlert.create({
      ...form,
      user_email: userEmail,
      center_lat: parseFloat(form.center_lat),
      center_lng: parseFloat(form.center_lng),
      radius_km: parseFloat(form.radius_km) || 10,
    });
    setSaving(false);
    onSaved();
  };

  return (
    <div className="space-y-4">
      {/* Name */}
      <div className="space-y-1">
        <Label className="dark:text-slate-300 text-sm">Alert Zone Name</Label>
        <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
          placeholder="e.g. Near Home, City Centre" className="dark:bg-slate-800 dark:border-slate-600 dark:text-white" />
      </div>

      {/* Quick region select */}
      <div className="space-y-1.5">
        <Label className="dark:text-slate-300 text-sm">Quick Region</Label>
        <div className="flex flex-wrap gap-1.5">
          {REGIONS.map(r => (
            <button key={r.label} onClick={() => applyRegion(r)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                form.location_label === r.label
                  ? 'bg-teal-600 text-white border-transparent'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-teal-400'
              }`}>{r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Manual coords */}
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1">
          <Label className="dark:text-slate-300 text-xs">Latitude</Label>
          <Input type="number" step="any" value={form.center_lat} onChange={e => setForm(p => ({ ...p, center_lat: e.target.value }))}
            placeholder="51.5074" className="dark:bg-slate-800 dark:border-slate-600 dark:text-white text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="dark:text-slate-300 text-xs">Longitude</Label>
          <Input type="number" step="any" value={form.center_lng} onChange={e => setForm(p => ({ ...p, center_lng: e.target.value }))}
            placeholder="-0.1278" className="dark:bg-slate-800 dark:border-slate-600 dark:text-white text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="dark:text-slate-300 text-xs">Radius (km)</Label>
          <Input type="number" min="1" max="500" value={form.radius_km} onChange={e => setForm(p => ({ ...p, radius_km: e.target.value }))}
            className="dark:bg-slate-800 dark:border-slate-600 dark:text-white text-sm" />
        </div>
      </div>

      {form.location_label && (
        <p className="text-xs text-teal-600 dark:text-teal-400 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {form.location_label} — {form.radius_km}km radius
        </p>
      )}

      {/* Observation types */}
      <div className="space-y-1.5">
        <Label className="dark:text-slate-300 text-sm">Watch These Types</Label>
        <div className="flex flex-wrap gap-2">
          {OBS_TYPES.map(({ key, label, icon: Icon, color }) => {
            const active = form.observation_types.includes(key);
            return (
              <button key={key} onClick={() => toggleArr('observation_types', key)}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-all ${
                  active ? 'bg-teal-600 text-white border-transparent' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}>
                <Icon className="w-3 h-3" /> {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Severities */}
      <div className="space-y-1.5">
        <Label className="dark:text-slate-300 text-sm">Alert on Severities</Label>
        <div className="flex gap-2">
          {SEVERITIES.map(({ key, color }) => {
            const active = form.severities.includes(key);
            return (
              <button key={key} onClick={() => toggleArr('severities', key)}
                className={`text-xs px-2.5 py-1 rounded-full border capitalize transition-all ${
                  active ? `${color} text-white border-transparent` : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}>{key}
              </button>
            );
          })}
        </div>
      </div>

      {/* Delivery */}
      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <Switch checked={form.notify_inapp} onCheckedChange={v => setForm(p => ({ ...p, notify_inapp: v }))} />
          <span className="text-sm text-slate-700 dark:text-slate-300">In-app</span>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={form.notify_email} onCheckedChange={v => setForm(p => ({ ...p, notify_email: v }))} />
          <span className="text-sm text-slate-700 dark:text-slate-300">Email</span>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={onCancel} className="dark:border-slate-600 dark:text-slate-300">
          <X className="w-4 h-4 mr-1" /> Cancel
        </Button>
        <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={save}
          disabled={saving || !form.name || !form.center_lat || !form.center_lng}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
          Save Zone
        </Button>
      </div>
    </div>
  );
}