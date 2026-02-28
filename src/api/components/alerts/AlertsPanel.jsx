import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, AlertTriangle, CheckCircle, Info, Zap, Wind, Droplets, Leaf, Volume2, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { base44 } from '../../base44Client';
import { formatDistanceToNow } from 'date-fns';

const alertConfig = {
  critical: { icon: AlertTriangle, bg: 'bg-rose-50 dark:bg-rose-950/40', border: 'border-rose-200 dark:border-rose-800', text: 'text-rose-700 dark:text-rose-400', badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300', dot: 'bg-rose-500' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-400', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300', dot: 'bg-amber-500' },
  info: { icon: Info, bg: 'bg-blue-50 dark:bg-blue-950/40', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-400', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300', dot: 'bg-blue-500' },
  success: { icon: CheckCircle, bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-200 dark:border-emerald-800', text: 'text-emerald-700 dark:text-emerald-400', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300', dot: 'bg-emerald-500' }
};

const typeIcons = { air_quality: Wind, water_quality: Droplets, biodiversity: Leaf, noise_level: Volume2, system: Zap };

export default function AlertsPanel({ open, onClose }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAlerts = async () => {
    setLoading(true);
    const data = await base44.entities.Alert.list('-created_date', 30);
    setAlerts(data);
    setLoading(false);
  };

  useEffect(() => {
    if (open) loadAlerts();
  }, [open]);

  // Real-time subscription
  useEffect(() => {
    const unsubscribe = base44.entities.Alert.subscribe((event) => {
      if (event.type === 'create') {
        setAlerts(prev => [event.data, ...prev]);
      } else if (event.type === 'update') {
        setAlerts(prev => prev.map(a => a.id === event.id ? event.data : a));
      } else if (event.type === 'delete') {
        setAlerts(prev => prev.filter(a => a.id !== event.id));
      }
    });
    return unsubscribe;
  }, []);

  const markRead = async (alertId) => {
    await base44.entities.Alert.update(alertId, { is_read: true });
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, is_read: true } : a));
  };

  const markAllRead = async () => {
    const unread = alerts.filter(a => !a.is_read);
    await Promise.all(unread.map(a => base44.entities.Alert.update(a.id, { is_read: true })));
    setAlerts(prev => prev.map(a => ({ ...a, is_read: true })));
  };

  const unreadCount = alerts.filter(a => !a.is_read).length;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-16 right-4 lg:top-6 lg:right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bell className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Alerts</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{unreadCount} unread</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium">
                    Mark all read
                  </button>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Alert List */}
            <div className="max-h-[480px] overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                  <Bell className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                  <p className="text-sm">Loading alerts...</p>
                </div>
              ) : alerts.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="font-medium text-slate-700 dark:text-slate-300">All clear!</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">No alerts at the moment</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {alerts.map((alert) => {
                    const config = alertConfig[alert.type] || alertConfig.info;
                    const AlertIcon = config.icon;
                    const TypeIcon = typeIcons[alert.observation_type] || Zap;
                    return (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 ${!alert.is_read ? config.bg : 'bg-white dark:bg-slate-900'} hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer`}
                        onClick={() => markRead(alert.id)}
                      >
                        <div className="flex gap-3">
                          <div className={`mt-0.5 p-2 rounded-lg ${config.bg} ${config.border} border flex-shrink-0`}>
                            <AlertIcon className={`w-4 h-4 ${config.text}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <p className={`text-sm font-semibold ${!alert.is_read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                  {alert.title}
                                </p>
                                {!alert.is_read && <div className={`w-2 h-2 rounded-full ${config.dot} flex-shrink-0`} />}
                              </div>
                              <Badge className={`text-[10px] px-1.5 py-0 flex-shrink-0 ${config.badge}`}>
                                {alert.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{alert.message}</p>
                            <div className="flex items-center gap-3 mt-2">
                              {alert.observation_type && (
                                <div className="flex items-center gap-1">
                                  <TypeIcon className="w-3 h-3 text-slate-400" />
                                  <span className="text-[10px] text-slate-400 capitalize">{alert.observation_type.replace('_', ' ')}</span>
                                </div>
                              )}
                              {alert.location_name && (
                                <span className="text-[10px] text-slate-400 truncate">📍 {alert.location_name}</span>
                              )}
                              <span className="text-[10px] text-slate-400 ml-auto flex-shrink-0">
                                {formatDistanceToNow(new Date(alert.created_date), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}