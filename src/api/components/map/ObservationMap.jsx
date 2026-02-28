import React, { useEffect, useRef } from 'react';
import { MapContainer, CircleMarker, Popup, useMap, LayersControl, TileLayer } from 'react-leaflet';
import { Wind, Droplets, Leaf, Volume2, AlertTriangle, MapPin, Calendar, User, Activity } from 'lucide-react';
import { format } from 'date-fns';
import 'leaflet/dist/leaflet.css';

export const typeColors = {
  air_quality: '#0EA5E9',
  water_quality: '#3B82F6',
  biodiversity: '#10B981',
  noise_level: '#F59E0B'
};

export const typeLabels = {
  air_quality: 'Air Quality',
  water_quality: 'Water Quality',
  biodiversity: 'Biodiversity',
  noise_level: 'Noise Level'
};

const typeIcons = { air_quality: Wind, water_quality: Droplets, biodiversity: Leaf, noise_level: Volume2 };

const severityConfig = {
  low: { radius: 7, opacity: 0.5, border: '#10B981', label: 'Low', bg: '#d1fae5', text: '#065f46' },
  moderate: { radius: 11, opacity: 0.55, border: '#F59E0B', label: 'Moderate', bg: '#fef3c7', text: '#92400e' },
  high: { radius: 15, opacity: 0.65, border: '#F97316', label: 'High', bg: '#ffedd5', text: '#9a3412' },
  critical: { radius: 20, opacity: 0.75, border: '#EF4444', label: 'Critical', bg: '#fee2e2', text: '#991b1b' }
};

// Auto-pan map when observations change
function MapController({ observations }) {
  const map = useMap();
  useEffect(() => {
    if (observations.length > 0) {
      const lats = observations.map(o => o.latitude);
      const lngs = observations.map(o => o.longitude);
      const minLat = Math.min(...lats), maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
      // Always fit bounds to show all observations with proper padding
      map.fitBounds([[minLat, minLng], [maxLat, maxLng]], { padding: [50, 50], maxZoom: 13 });
    }
  }, [observations, map]);
  return null;
}

export default function ObservationMap({ observations, center = [20.5937, 78.9629], zoom = 5, newIds = [] }) {
  const validObservations = observations?.filter(o => o.latitude && o.longitude) || [];

  return (
    <div style={{ position: 'relative', zIndex: 0, height: '100%', width: '100%' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full z-0"
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Carto Voyage (Road)">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="ESRI Satellite">
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Dark Matter">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        <MapController observations={validObservations} />

        {validObservations.map((obs) => {
          const sev = severityConfig[obs.severity] || severityConfig.low;
          const color = typeColors[obs.type] || '#64748b';
          const isNew = newIds.includes(obs.id);
          const Icon = typeIcons[obs.type];
          return (
            <CircleMarker
              key={obs.id}
              center={[obs.latitude, obs.longitude]}
              radius={isNew ? sev.radius + 4 : sev.radius}
              fillColor={color}
              color={isNew ? '#FF0080' : sev.border}
              weight={isNew ? 3 : 2}
              opacity={0.9}
              fillOpacity={sev.opacity}
            >
              <Popup maxWidth={280} minWidth={240}>
                <div style={{ fontFamily: 'system-ui, sans-serif' }}>
                  {/* Header bar */}
                  <div style={{ background: color, borderRadius: '8px 8px 0 0', padding: '10px 12px', margin: '-8px -12px 10px -12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 6, padding: '3px 6px', fontSize: 11, color: '#fff', fontWeight: 700 }}>
                        {typeLabels[obs.type] || obs.type}
                      </span>
                      {isNew && <span style={{ background: '#FF0080', borderRadius: 6, padding: '2px 6px', fontSize: 10, color: '#fff', fontWeight: 700 }}>● LIVE</span>}
                    </div>
                    <p style={{ color: '#fff', fontWeight: 700, fontSize: 14, margin: '4px 0 0' }}>{obs.title}</p>
                  </div>

                  {/* Severity badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <span style={{ background: sev.bg, color: sev.text, border: `1px solid ${sev.border}`, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>
                      {sev.label} Severity
                    </span>
                    {obs.status && (
                      <span style={{ background: obs.status === 'validated' ? '#d1fae5' : '#f1f5f9', color: obs.status === 'validated' ? '#065f46' : '#475569', borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>
                        {obs.status}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {obs.description && (
                    <p style={{ color: '#475569', fontSize: 12, marginBottom: 8, lineHeight: 1.5 }}>{obs.description}</p>
                  )}

                  {/* Measurement */}
                  {obs.measurement_value != null && (
                    <div style={{ background: '#f8fafc', borderRadius: 8, padding: '8px 10px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Activity size={14} color={color} />
                      <span style={{ fontSize: 18, fontWeight: 700, color }}>{obs.measurement_value}</span>
                      <span style={{ fontSize: 12, color: '#64748b' }}>{obs.measurement_unit}</span>
                    </div>
                  )}

                  {/* AI Confidence */}
                  {obs.confidence_score != null && (
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', marginBottom: 2 }}>
                        <span>AI Confidence</span>
                        <span style={{ fontWeight: 700 }}>{obs.confidence_score}%</span>
                      </div>
                      <div style={{ background: '#e2e8f0', borderRadius: 4, height: 5 }}>
                        <div style={{ width: `${obs.confidence_score}%`, background: obs.confidence_score > 75 ? '#10B981' : obs.confidence_score > 50 ? '#F59E0B' : '#EF4444', height: 5, borderRadius: 4 }} />
                      </div>
                    </div>
                  )}

                  {/* Species */}
                  {obs.species_name && (
                    <p style={{ fontSize: 12, color: '#065f46', background: '#d1fae5', borderRadius: 6, padding: '3px 8px', marginBottom: 8 }}>🌿 {obs.species_name}</p>
                  )}

                  {/* Weather */}
                  {obs.weather_conditions && (
                    <p style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>🌤 {obs.weather_conditions}</p>
                  )}

                  {/* Tags */}
                  {obs.tags && obs.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                      {obs.tags.map(t => (
                        <span key={t} style={{ background: '#e0f2fe', color: '#0369a1', borderRadius: 4, padding: '2px 6px', fontSize: 10 }}>#{t}</span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 6, display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8' }}>
                    <span>📍 {obs.location_name || `${obs.latitude?.toFixed(3)}, ${obs.longitude?.toFixed(3)}`}</span>
                    <span>{obs.created_date ? format(new Date(obs.created_date), 'MMM d, HH:mm') : ''}</span>
                  </div>
                  {obs.created_by && (
                    <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>👤 {obs.created_by}</p>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Legend overlay */}
      <div style={{
        position: 'absolute', bottom: 30, left: 10, zIndex: 999,
        background: 'rgba(255,255,255,0.95)', borderRadius: 10, padding: '10px 14px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)', fontSize: 12, minWidth: 160
      }}>
        <p style={{ fontWeight: 700, color: '#1e293b', marginBottom: 8, fontSize: 11 }}>OBSERVATION TYPES</p>
        {Object.entries(typeColors).map(([type, color]) => {
          const Icon = typeIcons[type];
          return (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: color, flexShrink: 0 }} />
              <span style={{ color: '#475569' }}>{typeLabels[type]}</span>
            </div>
          );
        })}
        <div style={{ borderTop: '1px solid #e2e8f0', marginTop: 8, paddingTop: 8 }}>
          <p style={{ fontWeight: 700, color: '#1e293b', marginBottom: 6, fontSize: 11 }}>SEVERITY (SIZE)</p>
          {Object.entries(severityConfig).map(([sev, cfg]) => (
            <div key={sev} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
              <div style={{ width: cfg.radius * 1.2, height: cfg.radius * 1.2, borderRadius: '50%', background: cfg.bg, border: `2px solid ${cfg.border}`, flexShrink: 0 }} />
              <span style={{ color: '#475569' }}>{cfg.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}