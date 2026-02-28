import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Badge } from '@api/components/ui/badge';
import { format } from 'date-fns';

const TYPE_CONFIG = {
  air_quality:   { color: '#0ea5e9', label: 'Air Quality' },
  water_quality: { color: '#3b82f6', label: 'Water Quality' },
  biodiversity:  { color: '#10b981', label: 'Biodiversity' },
  noise_level:   { color: '#f59e0b', label: 'Noise Level' },
};

const SEVERITY_RADIUS = { low: 7, moderate: 9, high: 12, critical: 15 };

function FitBounds({ observations }) {
  const map = useMap();
  useEffect(() => {
    if (observations.length === 0) return;
    const valid = observations.filter(o => o.latitude && o.longitude);
    if (valid.length === 0) return;
    if (valid.length === 1) {
      map.setView([valid[0].latitude, valid[0].longitude], 11);
    } else {
      const bounds = valid.map(o => [o.latitude, o.longitude]);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [observations.length]);
  return null;
}

export default function ExploreMap({ observations }) {
  const valid = observations.filter(o => o.latitude && o.longitude);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700" style={{ height: 420 }}>
      <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>' />
        <FitBounds observations={valid} />
        {valid.map(obs => {
          const cfg = TYPE_CONFIG[obs.type] || { color: '#64748b', label: obs.type };
          const radius = SEVERITY_RADIUS[obs.severity] || 8;
          return (
            <CircleMarker key={obs.id} center={[obs.latitude, obs.longitude]}
              radius={radius} pathOptions={{ color: cfg.color, fillColor: cfg.color, fillOpacity: 0.7, weight: 2 }}>
              <Popup>
                <div className="text-xs space-y-1 min-w-[180px]">
                  <p className="font-bold text-slate-900 text-sm">{obs.title}</p>
                  <div className="flex gap-1 flex-wrap">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: cfg.color + '22', color: cfg.color }}>{cfg.label}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 capitalize">{obs.severity}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 capitalize">{obs.status}</span>
                  </div>
                  {obs.description && <p className="text-slate-600 line-clamp-2">{obs.description}</p>}
                  {obs.location_name && <p className="text-slate-500">📍 {obs.location_name}</p>}
                  {obs.measurement_value && <p className="text-slate-600">{obs.measurement_value} {obs.measurement_unit}</p>}
                  <p className="text-slate-400">{format(new Date(obs.created_date), 'MMM d, yyyy HH:mm')}</p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl p-2.5 shadow border border-slate-200 dark:border-slate-700 z-[400]">
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          {Object.entries(TYPE_CONFIG).map(([k, { color, label }]) => (
            <div key={k} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
              <span className="text-[10px] text-slate-700 dark:text-slate-300">{label}</span>
            </div>
          ))}
        </div>
        <div className="mt-1.5 pt-1.5 border-t border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <span className="text-[10px] text-slate-500">Size = severity</span>
          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{valid.length} shown</span>
        </div>
      </div>
    </div>
  );
}