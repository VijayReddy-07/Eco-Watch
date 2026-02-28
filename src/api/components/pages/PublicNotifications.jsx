import React, { useState, useEffect } from 'react';
import { useAuth } from '@api/components/lib/AuthContext';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@api/components/ui/card';
import { Badge } from '@api/components/ui/badge';
import { Button } from '@api/components/ui/button';
import {
  Bell, CheckCircle, AlertTriangle, Info, Inbox, Trash2,
  Calendar, User, MapPin, Clock, ArrowRight
} from 'lucide-react';

export default function PublicNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      // Try again after a short delay if user hasn't loaded yet
      const timer = setTimeout(() => {
        if (!user?.id) setIsReady(true);
      }, 500);
      return () => clearTimeout(timer);
    }

    // Load stored notifications
    const stored = localStorage.getItem(`notifications_${user.id}`);
    if (stored) {
      try {
        setNotifications(JSON.parse(stored));
      } catch (e) {
        // Initialize with sample notifications
        initializeSampleNotifications();
      }
    } else {
      initializeSampleNotifications();
    }
    setIsReady(true);
  }, [user?.id]);

  const initializeSampleNotifications = () => {
    if (!user?.id) return;

    const samples = [
      {
        id: 1,
        type: 'validated',
        title: 'Observation Validated',
        message: 'Your air quality observation from March 12 has been validated and added to the global dataset!',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        read: false,
        details: 'Air Quality - PM2.5 measurement'
      },
      {
        id: 2,
        type: 'info',
        title: 'Weekly Digest Available',
        message: 'Check out this week\'s environmental trends and compare your observations with global data.',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        read: false,
        details: 'Global environmental summary'
      },
      {
        id: 3,
        type: 'alert',
        title: 'Review Requested',
        message: 'Your recent biodiversity observation needs clarification. Please check the comments.',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        read: true,
        details: 'Biodiversity - Species count verification'
      },
      {
        id: 4,
        type: 'success',
        title: 'New Badge Earned!',
        message: 'Congratulations! You\'ve earned the "Rising Contributor" badge with 5 validated observations.',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        read: true,
        details: 'Achievement unlocked'
      }
    ];
    setNotifications(samples);
    localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(samples));
  };

  const markAsRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(updated));
  };

  const deleteNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(updated));
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.setItem(`notifications_${user?.id}`, JSON.stringify([]));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'validated') return n.type === 'validated';
    if (filter === 'alerts') return n.type === 'alert';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'validated':
        return CheckCircle;
      case 'alert':
        return AlertTriangle;
      case 'success':
        return CheckCircle;
      default:
        return Info;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'validated':
        return 'emerald';
      case 'alert':
        return 'amber';
      case 'success':
        return 'emerald';
      default:
        return 'blue';
    }
  };

  if (!isReady || !user?.id) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #f0fdf4, #ffffff, #f0fdfa)' }}>
        <div style={{ textAlign: 'center', background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ width: '50px', height: '50px', border: '4px solid #e2e8f0', borderTop: '4px solid #059669', borderRadius: '50%', margin: '0 auto 20px', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ color: '#475569', fontWeight: '600', fontSize: '16px' }}>Loading your notifications...</p>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '10px' }}>Please wait a moment</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pb-16">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
                  <Bell className="w-10 h-10" />
                  Notifications
                </h1>
                <p className="text-emerald-50">Stay updated on your observations and activities</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Controls */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'unread', label: 'Unread', icon: unreadCount },
              { id: 'validated', label: 'Validated' },
              { id: 'alerts', label: 'Alerts' }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id)}
                className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${filter === btn.id
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
              >
                {btn.label}
                {btn.icon && <Badge className="bg-red-500 ml-1">{btn.icon}</Badge>}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                variant="outline"
                className="flex items-center gap-2"
              >
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                onClick={clearAll}
                variant="outline"
                className="flex items-center gap-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </Button>
            )}
          </div>
        </motion.div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="border-0 shadow-lg border-2 border-dashed border-slate-300">
                <CardContent className="pt-12 pb-12 text-center">
                  <Inbox className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No Notifications</h3>
                  <p className="text-slate-600">
                    {filter === 'all' ? 'You\'re all caught up!' : 'No notifications match your filter'}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            filteredNotifications.map((notification, index) => {
              const Icon = getNotificationIcon(notification.type);
              const color = getNotificationColor(notification.type);

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                  className={`transition-all cursor-pointer ${!notification.read ? 'bg-gradient-to-r from-emerald-50 to-teal-50' : 'bg-white'
                    }`}
                >
                  <Card className={`border-l-4 hover:shadow-lg transition-all ${color === 'emerald' ? 'border-l-emerald-500' :
                      color === 'amber' ? 'border-l-amber-500' :
                        'border-l-blue-500'
                    }`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`p-3 rounded-lg flex-shrink-0 ${color === 'emerald' ? 'bg-emerald-100' :
                            color === 'amber' ? 'bg-amber-100' :
                              'bg-blue-100'
                          }`}>
                          <Icon className={`w-6 h-6 ${color === 'emerald' ? 'text-emerald-600' :
                              color === 'amber' ? 'text-amber-600' :
                                'text-blue-600'
                            }`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <h3 className="font-bold text-slate-900 text-lg">{notification.title}</h3>
                              {!notification.read && (
                                <Badge className="bg-emerald-600 mt-1">Unread</Badge>
                              )}
                            </div>
                          </div>

                          <p className="text-slate-600 mb-3">{notification.message}</p>

                          {notification.details && (
                            <div className="p-3 bg-slate-50 rounded-lg mb-3">
                              <p className="text-sm text-slate-700 font-semibold flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                {notification.details}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {new Date(notification.timestamp).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          <button className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors">
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl"
        >
          <div className="flex gap-4">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-blue-900 mb-2">Notification Settings</h4>
              <p className="text-blue-800 text-sm">
                Manage which notifications you receive by visiting your Settings page. You can customize email alerts, weekly digests, and more.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
