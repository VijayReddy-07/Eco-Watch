import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, PlusCircle, Map, Database, BarChart3,
  Menu, X, Leaf, ChevronRight, Bell, Sun, Moon, User, Zap, BellRing, LogOut, Users, Volume2
} from 'lucide-react';
import { Button } from '@api/components/ui/button';
import { ThemeProvider, useTheme } from '@api/components/ThemeContext';
import AlertsPanel from '@api/components/alerts/AlertsPanel';
import FeedbackFAB from '@api/components/feedback/FeedbackFAB';
import { useAuth } from '@api/components/lib/AuthContext';
import { base44 } from '@/api/base44Client';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: 'Dashboard', label: 'Overview & insights' },
  { name: 'Submit', icon: PlusCircle, path: 'Submit', label: 'Report an observation' },
  { name: 'Map', icon: Map, path: 'Map', label: 'Explore data on map' },
  { name: 'Explorer', icon: Database, path: 'Explorer', label: 'Browse all data' },
  { name: 'Analytics', icon: BarChart3, path: 'Analytics', label: 'Trends & statistics' },
  { name: 'AcousticVault', icon: Volume2, path: 'AcousticVault', label: 'AI Sound Analytics' },
  { name: 'Notifications', icon: BellRing, path: 'Notifications', label: 'Alerts & preferences' },
  { name: 'Profile', icon: User, path: 'Profile', label: 'Your account' }
];

function LayoutInner({ children, currentPageName }) {
  const { theme, toggleTheme } = useTheme();
  const { logout, logoutPublicAccess, isPublicAccess } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    base44.entities.Alert.list('-created_date', 50).then(alerts => {
      setUnreadCount(alerts.filter(a => !a.is_read).length);
    });
    const unsub = base44.entities.Alert.subscribe((event) => {
      if (event.type === 'create') setUnreadCount(c => c + 1);
      if (event.type === 'update' && event.data.is_read) setUnreadCount(c => Math.max(0, c - 1));
    });
    return unsub;
  }, []);

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col z-30">
        <div className={`flex grow flex-col gap-y-5 overflow-y-auto border-r px-6 py-6 transition-colors ${isDark ? 'bg-slate-900 border-slate-700/50' : 'bg-white border-slate-200'}`}>
          {/* Logo */}
          <Link to={createPageUrl('Dashboard')} className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>EcoWatch</h1>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Citizen Science Platform</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col mt-2">
            <p className={`px-4 text-[10px] font-semibold uppercase tracking-widest mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Navigation</p>
            <ul className="space-y-0.5">
              {(isPublicAccess
                ? [
                  { name: 'Dashboard', icon: LayoutDashboard, path: 'Dashboard', label: 'Submit data' },
                  { name: 'Notifications', icon: BellRing, path: 'PublicNotifications', label: 'Your alerts' },
                  { name: 'Profile', icon: User, path: 'PublicProfile', label: 'Settings' }
                ]
                : navItems
              ).map((item) => {
                const isActive = currentPageName === item.path;
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path.startsWith('Public') ? `/${item.path}` : createPageUrl(item.path)}
                      className={`group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${isActive
                        ? isDark ? 'bg-teal-900/50 text-teal-400' : 'bg-teal-50 text-teal-700'
                        : isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                      <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-teal-50' : isDark ? 'text-slate-500 group-hover:text-slate-300' : 'text-slate-400 group-hover:text-slate-600'}`} />
                      <div className="flex-1 min-w-0">
                        <p>{item.name}</p>
                        {!isActive && <p className={`text-[10px] truncate ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{item.label}</p>}
                      </div>
                      {isActive && <ChevronRight className="w-4 h-4 flex-shrink-0 text-teal-500" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom Controls */}
          <div className="space-y-3">
            {/* Theme Toggle */}
            <div className={`flex items-center justify-between px-4 py-2.5 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <div className="flex items-center gap-2">
                {isDark ? <Moon className="w-4 h-4 text-slate-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative w-11 h-6 rounded-full transition-colors ${isDark ? 'bg-teal-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${isDark ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => isPublicAccess ? logoutPublicAccess() : logout()}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl w-full transition-colors ${isDark ? 'text-rose-400 hover:bg-rose-900/30' : 'text-rose-600 hover:bg-rose-50'}`}
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-bold uppercase tracking-widest italic">Sign Out</span>
            </button>

            {/* CTA - Expert Only */}
            {!isPublicAccess && (
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4" />
                  <h3 className="font-semibold">Make a Difference</h3>
                </div>
                <p className="text-sm text-teal-100 mb-4">Your data helps scientists monitor environmental health.</p>
                <Link to={createPageUrl('Submit')}>
                  <Button className="w-full bg-white text-teal-700 hover:bg-teal-50">
                    <PlusCircle className="w-4 h-4 mr-2" /> Submit Observation
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className={`lg:hidden sticky top-0 z-50 border-b backdrop-blur-md transition-colors ${isDark ? 'bg-slate-900/95 border-slate-700/50' : 'bg-white/95 border-slate-200'}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <Link to={createPageUrl('Dashboard')} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>EcoWatch</span>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-500" />}
            </button>
            <button onClick={() => setAlertsOpen(v => !v)} className={`relative p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
              <Bell className={`w-5 h-5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
              )}
            </button>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
              <Menu className={`w-6 h-6 ${isDark ? 'text-white' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Alerts Bell (top-right floating) */}
      <div className="hidden lg:flex fixed top-5 right-6 z-40 items-center gap-3">
        <button
          onClick={() => setAlertsOpen(v => !v)}
          className={`relative p-2.5 rounded-xl shadow-md transition-all ${isDark ? 'bg-slate-800 hover:bg-slate-700 border border-slate-700' : 'bg-white hover:bg-slate-50 border border-slate-200'}`}
        >
          <Bell className={`w-5 h-5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Alerts Panel */}
      <AlertsPanel open={alertsOpen} onClose={() => setAlertsOpen(false)} />

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`fixed right-0 top-0 bottom-0 w-72 z-50 lg:hidden shadow-2xl ${isDark ? 'bg-slate-900' : 'bg-white'}`}
            >
              <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <nav className="p-4">
                <ul className="space-y-1">
                  {(isPublicAccess
                    ? [
                      { name: 'Dashboard', icon: LayoutDashboard, path: 'Dashboard', label: 'Submit data' },
                      { name: 'Notifications', icon: BellRing, path: 'PublicNotifications', label: 'Your alerts' },
                      { name: 'Profile', icon: User, path: 'PublicProfile', label: 'Settings' }
                    ]
                    : navItems
                  ).map((item) => {
                    const isActive = currentPageName === item.path;
                    const Icon = item.icon;
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.path.startsWith('Public') ? `/${item.path}` : createPageUrl(item.path)}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${isActive
                            ? isDark ? 'bg-teal-900/50 text-teal-400' : 'bg-teal-50 text-teal-700'
                            : isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                          <Icon className={`w-5 h-5 ${isActive ? 'text-teal-500' : isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className={`mt-6 pt-6 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      isPublicAccess ? logoutPublicAccess() : logout();
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-rose-500 font-black uppercase tracking-widest text-xs italic"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Feedback System */}
      <FeedbackFAB />

      {/* Main Content */}
      <main className="lg:pl-72">
        {children}
      </main>
    </div>
  );
}

export default function Layout(props) {
  return (
    <ThemeProvider>
      <LayoutInner {...props} />
    </ThemeProvider>
  );
}