import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@api/components/ui/button';
import { Badge } from '@api/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@api/components/ui/card';
import { Switch } from '@api/components/ui/switch';
import { Separator } from '@api/components/ui/separator';
import {
  Bell, AlertTriangle, CheckCircle, Info, Zap, Wind, Droplets, Leaf,
  Volume2, Trash2, Check, Mail, BellOff, RefreshCw, Filter, Loader2, MapPin
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from '@api/components/ThemeContext';
import LocationAlertsList from '@api/components/notifications/LocationAlertsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@api/components/ui/tabs';

const alertConfig = {
  critical: { icon: AlertTriangle, bg: 'bg-rose-50 dark:bg-rose-950/40', border: 'border-rose-200 dark:border-rose-800', text: 'text-rose-700 dark:text-rose-400', badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300', dot: 'bg-rose-500' },
  warning:  { icon: AlertTriangle, bg: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-400', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300', dot: 'bg-amber-500' },
  info:     { icon: Info, bg: 'bg-blue-50 dark:bg-blue-950/40', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-400', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300', dot: 'bg-blue-500' },
  success:  { icon: CheckCircle, bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-200 dark:border-emerald-800', text: 'text-emerald-700 dark:text-emerald-400', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300', dot: 'bg-emerald-500' }
};

const typeIcons = { air_quality: Wind, water_quality: Droplets, biodiversity: Leaf, noise_level: Volume2, system: Zap };

const emailPrefsConfig = [
  { key: 'critical_alerts',   label: 'Critical Alerts',    desc: 'Email when critical severity observations are submitted', icon: AlertTriangle, color: 'text-rose-600' },
  { key: 'new_observations',  label: 'New Observations',   desc: 'Email when new data is submitted in your area', icon: Bell, color: 'text-blue-600' },
  { key: 'weekly_digest',     label: 'Weekly Digest',      desc: 'Weekly summary of environmental trends', icon: Mail, color: 'text-teal-600' },
  { key: 'validation_updates',label: 'Validation Updates', desc: 'Email when your observations are validated or flagged', icon: CheckCircle, color: 'text-emerald-600' },
];

export default function Notifications() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('all'); // all | unread | critical | info | success | warning
  const [deletingId, setDeletingId] = useState(null);
  const [savingPrefs, setSavingPrefs] = useState(false);

  useEffect(() => { base44.auth.me().then(setUser); }, []);

  const { data: alerts = [], isLoading, refetch } = useQuery({
    queryKey: ['notifications-all'],
    queryFn: () => base44.entities.Alert.list('-created_date', 100),
  });

  const { data: profile } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const profiles = await base44.entities.UserProfile.filter({ user_email: user.email });
      return profiles[0] || null;
    },
    enabled: !!user?.email,
  });

  const locationAlertQKey = ['locationAlerts', user?.email];
  const { data: locationAlerts = [] } = useQuery({
    queryKey: locationAlertQKey,
    queryFn: () => base44.entities.LocationAlert.filter({ user_email: user.email }),
    enabled: !!user?.email,
  });

  const [prefs, setPrefs] = useState({ critical_alerts: true, new_observations: false, weekly_digest: true, validation_updates: true });

  useEffect(() => {
    if (profile?.notification_preferences) {
      setPrefs(p => ({ ...p, ...profile.notification_preferences }));
    }
  }, [profile]);

  // Real-time subscription
  useEffect(() => {
    const unsub = base44.entities.Alert.subscribe((event) => {
      queryClient.invalidateQueries({ queryKey: ['notifications-all'] });
    });
    return unsub;
  }, [queryClient]);

  const markRead = async (id) => {
    await base44.entities.Alert.update(id, { is_read: true });
    queryClient.invalidateQueries({ queryKey: ['notifications-all'] });
  };

  const markAllRead = async () => {
    const unread = alerts.filter(a => !a.is_read);
    await Promise.all(unread.map(a => base44.entities.Alert.update(a.id, { is_read: true })));
    queryClient.invalidateQueries({ queryKey: ['notifications-all'] });
  };

  const deleteAlert = async (id) => {
    setDeletingId(id);
    await base44.entities.Alert.delete(id);
    queryClient.invalidateQueries({ queryKey: ['notifications-all'] });
    setDeletingId(null);
  };

  const clearAll = async () => {
    await Promise.all(alerts.map(a => base44.entities.Alert.delete(a.id)));
    queryClient.invalidateQueries({ queryKey: ['notifications-all'] });
  };

  const savePrefs = async (newPrefs) => {
    if (!profile) return;
    setSavingPrefs(true);
    await base44.entities.UserProfile.update(profile.id, {
      notification_preferences: newPrefs
    });
    queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    setSavingPrefs(false);
  };

  const togglePref = (key) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    savePrefs(updated);
  };

  const filtered = alerts.filter(a => {
    if (filter === 'unread') return !a.is_read;
    if (filter === 'all') return true;
    return a.type === filter;
  });

  const unreadCount = alerts.filter(a => !a.is_read).length;

  const filterTabs = [
    { key: 'all',      label: 'All',      count: alerts.length },
    { key: 'unread',   label: 'Unread',   count: unreadCount },
    { key: 'critical', label: 'Critical', count: alerts.filter(a => a.type === 'critical').length },
    { key: 'warning',  label: 'Warning',  count: alerts.filter(a => a.type === 'warning').length },
    { key: 'info',     label: 'Info',     count: alerts.filter(a => a.type === 'info').length },
    { key: 'success',  label: 'Success',  count: alerts.filter(a => a.type === 'success').length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <Bell className="w-8 h-8 text-teal-500" /> Notifications
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => refetch()} className="dark:border-slate-600 dark:text-slate-300">
                <RefreshCw className="w-4 h-4 mr-2" /> Refresh
              </Button>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllRead} className="dark:border-slate-600 dark:text-slate-300">
                  <Check className="w-4 h-4 mr-2" /> Mark all read
                </Button>
              )}
              {alerts.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearAll} className="text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950/30">
                  <Trash2 className="w-4 h-4 mr-2" /> Clear all
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="dark:bg-slate-800">
            <TabsTrigger value="feed" className="gap-2"><Bell className="w-4 h-4" /> Feed</TabsTrigger>
            <TabsTrigger value="location" className="gap-2"><MapPin className="w-4 h-4" /> Location Zones</TabsTrigger>
            <TabsTrigger value="settings" className="gap-2"><Filter className="w-4 h-4" /> Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="feed">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Notifications Feed */}
              <div className="lg:col-span-2 space-y-4">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {filterTabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    filter === tab.key
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-teal-300'
                  }`}
                >
                  <Filter className="w-3 h-3" />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      filter === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>{tab.count}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Alerts List */}
            <Card className="dark:bg-slate-900 dark:border-slate-700 overflow-hidden">
              {isLoading ? (
                <div className="p-12 text-center">
                  <Loader2 className="w-8 h-8 text-teal-500 animate-spin mx-auto mb-3" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">Loading notifications...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BellOff className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">No notifications</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {filter === 'unread' ? 'All notifications have been read.' : 'Nothing here yet.'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  <AnimatePresence>
                    {filtered.map((alert) => {
                      const config = alertConfig[alert.type] || alertConfig.info;
                      const AlertIcon = config.icon;
                      const TypeIcon = typeIcons[alert.observation_type] || Zap;
                      return (
                        <motion.div
                          key={alert.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10, height: 0 }}
                          className={`p-4 transition-colors ${!alert.is_read ? config.bg : 'bg-white dark:bg-slate-900'} hover:bg-slate-50 dark:hover:bg-slate-800/40`}
                        >
                          <div className="flex gap-3">
                            <div className={`mt-0.5 p-2 rounded-xl ${config.bg} ${config.border} border flex-shrink-0`}>
                              <AlertIcon className={`w-4 h-4 ${config.text}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <p className={`text-sm font-semibold truncate ${!alert.is_read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                    {alert.title}
                                  </p>
                                  {!alert.is_read && <div className={`w-2 h-2 rounded-full flex-shrink-0 ${config.dot}`} />}
                                </div>
                                <Badge className={`text-[10px] px-1.5 py-0 flex-shrink-0 ${config.badge}`}>{alert.type}</Badge>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{alert.message}</p>
                              <div className="flex items-center gap-3 mt-2">
                                {alert.observation_type && (
                                  <div className="flex items-center gap-1">
                                    <TypeIcon className="w-3 h-3 text-slate-400" />
                                    <span className="text-[10px] text-slate-400 capitalize">{alert.observation_type.replace('_', ' ')}</span>
                                  </div>
                                )}
                                {alert.location_name && <span className="text-[10px] text-slate-400">📍 {alert.location_name}</span>}
                                <span className="text-[10px] text-slate-400 ml-auto">
                                  {formatDistanceToNow(new Date(alert.created_date), { addSuffix: true })}
                                </span>
                              </div>
                            </div>
                            {/* Actions */}
                            <div className="flex flex-col gap-1 flex-shrink-0">
                              {!alert.is_read && (
                                <button
                                  onClick={() => markRead(alert.id)}
                                  title="Mark as read"
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-colors"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => deleteAlert(alert.id)}
                                disabled={deletingId === alert.id}
                                title="Delete"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                              >
                                {deletingId === alert.id
                                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  : <Trash2 className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </Card>
          </div>

              {/* Sidebar: Quick Stats */}
              <div className="space-y-5">
                <Card className="dark:bg-slate-900 dark:border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base dark:text-white">Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      { label: 'Total',    value: alerts.length, color: 'text-slate-700 dark:text-slate-300' },
                      { label: 'Unread',   value: unreadCount, color: 'text-rose-600 dark:text-rose-400' },
                      { label: 'Critical', value: alerts.filter(a => a.type === 'critical').length, color: 'text-rose-600' },
                      { label: 'Warnings', value: alerts.filter(a => a.type === 'warning').length, color: 'text-amber-600' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800 last:border-0">
                        <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
                        <span className={`font-bold text-sm ${color}`}>{value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>


          <TabsContent value="location">
            <Card className="dark:bg-slate-900 dark:border-slate-700">
              <CardContent className="pt-6">
                <LocationAlertsList locationAlerts={locationAlerts} userEmail={user?.email} queryKey={locationAlertQKey} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid sm:grid-cols-2 gap-5 max-w-2xl">
              {/* In-App */}
              <Card className="dark:bg-slate-900 dark:border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base dark:text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-teal-500" /> In-App Alerts
                  </CardTitle>
                  <CardDescription className="dark:text-slate-400 text-xs">Control which events appear in the notification panel</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { key: 'critical_alerts',    label: 'Critical Events',    desc: 'Severity: critical',    icon: AlertTriangle, color: 'text-rose-500' },
                    { key: 'new_observations',   label: 'New Submissions',    desc: 'Community observations', icon: Bell, color: 'text-blue-500' },
                    { key: 'validation_updates', label: 'Status Changes',     desc: 'Validation & flags',    icon: CheckCircle, color: 'text-emerald-500' },
                  ].map(({ key, label, desc, icon: Icon, color }) => (
                    <div key={key} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">{desc}</p>
                        </div>
                      </div>
                      <Switch checked={prefs[key] ?? true} onCheckedChange={() => togglePref(key)} />
                    </div>
                  ))}
                </CardContent>
              </Card>
              {/* Email */}
              <Card className="dark:bg-slate-900 dark:border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base dark:text-white flex items-center gap-2">
                      <Mail className="w-4 h-4 text-teal-500" /> Email Alerts
                    </CardTitle>
                    {savingPrefs && <Loader2 className="w-4 h-4 text-teal-500 animate-spin" />}
                  </div>
                  <CardDescription className="dark:text-slate-400 text-xs">Choose what emails you want to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {emailPrefsConfig.map(({ key, label, desc, icon: Icon, color }) => (
                    <div key={key} className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 min-w-0">
                        <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${color}`} />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">{desc}</p>
                        </div>
                      </div>
                      <Switch checked={prefs[key] ?? true} onCheckedChange={() => togglePref(key)} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}