import React, { useState, useEffect } from 'react';
import { useAuth } from '@api/components/lib/AuthContext';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@api/components/ui/card';
import { Button } from '@api/components/ui/button';
import { Input } from '@api/components/ui/input';
import { Label } from '@api/components/ui/label';
import { Badge } from '@api/components/ui/badge';
import {
  Settings, Bell, Shield, Eye, Database, Download, Trash2,
  LogOut, AlertCircle, CheckCircle, Mail, Map, Users
} from 'lucide-react';

export default function PublicProfile() {
  const { user, logoutPublicAccess, isPublicAccess } = useAuth();
  const [isReady, setIsReady] = React.useState(false);

  // Check if user is loaded
  React.useEffect(() => {
    // Only show loading if user truly doesn't exist yet
    if (user) {
      setIsReady(true);
    }
  }, [user]);

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #f0fdf4, #ffffff, #f0fdfa)' }}>
        <div style={{ textAlign: 'center', background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ width: '50px', height: '50px', border: '4px solid #e2e8f0', borderTop: '4px solid #059669', borderRadius: '50%', margin: '0 auto 20px', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ color: '#475569', fontWeight: '600', fontSize: '16px' }}>Loading your settings...</p>
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

  const [settings, setSettings] = useState({
    emailNotifications: true,
    validationAlerts: true,
    weeklyDigest: true,
    communityUpdates: false,
    allowAnalytics: true,
    showProfile: false,
    dataCollection: true
  });

  const [profileData, setProfileData] = useState(() => {
    const stored = localStorage.getItem(`profile_${user?.id}`);
    return stored ? JSON.parse(stored) : {
      bio: '',
      location: '',
      website: '',
      interests: []
    };
  });

  const [saveStatus, setSaveStatus] = useState('');
  const [activeTab, setActiveTab] = useState('notifications');

  useEffect(() => {
    const stored = localStorage.getItem(`settings_${user?.id}`);
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load settings');
      }
    }
  }, [user?.id]);

  const handleSettingChange = (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    if (user?.id) {
      localStorage.setItem(`settings_${user.id}`, JSON.stringify(updated));
    }
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const handleProfileChange = (key, value) => {
    const updated = { ...profileData, [key]: value };
    setProfileData(updated);
    if (user?.id) {
      localStorage.setItem(`profile_${user.id}`, JSON.stringify(updated));
    }
  };

  const downloadData = () => {
    const submissions = localStorage.getItem(`submissions_${user?.id}`);
    const dataToDownload = {
      profile: { name: user?.name, email: user?.email },
      submissions: submissions ? JSON.parse(submissions) : [],
      downloadDate: new Date().toISOString()
    };

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dataToDownload, null, 2)));
    element.setAttribute('download', `eco-watch-data-${new Date().toISOString().split('T')[0]}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pb-16">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-2">Settings & Preferences</h1>
            <p className="text-emerald-50">Manage your account, notifications, and privacy</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'profile', label: 'Profile', icon: Settings },
            { id: 'privacy', label: 'Privacy & Data', icon: Shield },
            { id: 'account', label: 'Account', icon: LogOut }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-600">
                  <Bell className="w-6 h-6" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Control how and when you receive updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    key: 'emailNotifications',
                    title: 'Email Notifications',
                    description: 'Receive updates about your submissions via email',
                    icon: Mail
                  },
                  {
                    key: 'validationAlerts',
                    title: 'Validation Alerts',
                    description: 'Get notified when your submissions are validated or flagged',
                    icon: CheckCircle
                  },
                  {
                    key: 'weeklyDigest',
                    title: 'Weekly Digest',
                    description: 'Receive a weekly summary of environmental trends',
                    icon: Database
                  },
                  {
                    key: 'communityUpdates',
                    title: 'Community Updates',
                    description: 'Get notified about community achievements and milestones',
                    icon: Users
                  }
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <motion.div
                      key={option.key}
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <Icon className="w-5 h-5 text-emerald-600 mt-1" />
                        <div>
                          <p className="font-bold text-slate-900">{option.title}</p>
                          <p className="text-sm text-slate-600 mt-1">{option.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSettingChange(option.key)}
                        className={`relative w-14 h-8 rounded-full transition-all ${settings[option.key] ? 'bg-emerald-600' : 'bg-slate-300'
                          }`}
                      >
                        <div
                          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${settings[option.key] ? 'translate-x-6' : 'translate-x-0'
                            }`}
                        />
                      </button>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>

            {saveStatus && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 font-semibold"
              >
                <CheckCircle className="w-5 h-5" />
                Settings saved successfully
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-600">
                  <Settings className="w-6 h-6" />
                  Profile Information
                </CardTitle>
                <CardDescription>Update your public profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="font-bold mb-2">Name</Label>
                  <Input
                    value={user?.name || ''}
                    disabled
                    className="bg-slate-100 text-slate-900"
                  />
                  <p className="text-xs text-slate-500 mt-2">Your name cannot be changed</p>
                </div>

                <div>
                  <Label className="font-bold mb-2">Bio</Label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                    placeholder="Tell the community about your environmental interests..."
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                    rows={4}
                  />
                  <p className="text-xs text-slate-500 mt-2">{profileData.bio.length}/200 characters</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="font-bold mb-2 flex items-center gap-2">
                      <Map className="w-4 h-4" />
                      Location
                    </Label>
                    <Input
                      value={profileData.location}
                      onChange={(e) => handleProfileChange('location', e.target.value)}
                      placeholder="e.g. California, USA"
                    />
                  </div>
                  <div>
                    <Label className="font-bold mb-2">Website</Label>
                    <Input
                      value={profileData.website}
                      onChange={(e) => handleProfileChange('website', e.target.value)}
                      placeholder="https://yourwebsite.com"
                      type="url"
                    />
                  </div>
                </div>

                <div>
                  <Label className="font-bold mb-3 block">Research Interests</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Air Quality', 'Water Quality', 'Biodiversity', 'Climate', 'Pollution', 'Conservation'].map((interest) => (
                      <button
                        key={interest}
                        onClick={() => {
                          const updated = profileData.interests.includes(interest)
                            ? profileData.interests.filter(i => i !== interest)
                            : [...profileData.interests, interest];
                          handleProfileChange('interests', updated);
                        }}
                        className={`px-4 py-2 rounded-full font-semibold transition-all ${profileData.interests.includes(interest)
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Eye className="w-5 h-5 text-emerald-600 mt-1" />
                    <div>
                      <p className="font-bold text-slate-900">Profile Visibility</p>
                      <p className="text-sm text-slate-600 mt-1">Your profile is currently private. Make it public to appear on leaderboards.</p>
                      <button
                        onClick={() => handleSettingChange('showProfile')}
                        className={`mt-3 px-4 py-2 rounded-lg font-bold transition-all ${settings.showProfile
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white text-emerald-600 border border-emerald-600 hover:bg-emerald-50'
                          }`}
                      >
                        {settings.showProfile ? '✓ Public Profile' : 'Make Public'}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Privacy & Data Tab */}
        {activeTab === 'privacy' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-600">
                  <Shield className="w-6 h-6" />
                  Privacy & Data Management
                </CardTitle>
                <CardDescription>Control how your data is used and stored</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    key: 'allowAnalytics',
                    title: 'Allow Analytics',
                    description: 'Help us improve by sharing anonymous usage data',
                    icon: Database
                  },
                  {
                    key: 'dataCollection',
                    title: 'Data Collection',
                    description: 'Allow collection of location and observation metadata',
                    icon: Database
                  }
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <motion.div
                      key={option.key}
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <Icon className="w-5 h-5 text-emerald-600 mt-1" />
                        <div>
                          <p className="font-bold text-slate-900">{option.title}</p>
                          <p className="text-sm text-slate-600 mt-1">{option.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSettingChange(option.key)}
                        className={`relative w-14 h-8 rounded-full transition-all ${settings[option.key] ? 'bg-emerald-600' : 'bg-slate-300'
                          }`}
                      >
                        <div
                          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${settings[option.key] ? 'translate-x-6' : 'translate-x-0'
                            }`}
                        />
                      </button>
                    </motion.div>
                  );
                })}

                <div className="border-t pt-6">
                  <h3 className="font-bold text-slate-900 mb-4">Data Management</h3>
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={downloadData}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all"
                    >
                      <Download className="w-5 h-5" />
                      Download My Data
                    </motion.button>
                    <p className="text-xs text-slate-600 text-center">Export all your submissions and profile data as JSON</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Account Tab */}
        {activeTab === 'account' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-600">
                  <LogOut className="w-6 h-6" />
                  Account Actions
                </CardTitle>
                <CardDescription>Manage your account session</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-bold text-blue-900">Session Info</p>
                    <p className="text-sm text-blue-700 mt-1">
                      You're logged in as a public observer. Your data is stored locally in your browser.
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={logoutPublicAccess}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all shadow-lg"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </motion.button>

                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-600">
                    When you sign out, you'll need to create a new account or login again with the same credentials to access your submissions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
