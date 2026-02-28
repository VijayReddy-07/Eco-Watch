import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@api/components/ui/button';
import { Input } from '@api/components/ui/input';
import { Textarea } from '@api/components/ui/textarea';
import { Label } from '@api/components/ui/label';
import { Badge } from '@api/components/ui/badge';
import { Switch } from '@api/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@api/components/ui/card';
import { Separator } from '@api/components/ui/separator';
import {
  User, Mail, MapPin, Edit3, Save, X, Camera, Wind, Droplets, Leaf,
  Volume2, Award, Star, CheckCircle, TrendingUp, Bell, Moon, Sun, Loader2
} from 'lucide-react';
import { useTheme } from '@api/components/ThemeContext';
import { format } from 'date-fns';

const badgeConfig = {
  'First Submission': { icon: Star, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' },
  'Verified Contributor': { icon: CheckCircle, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' },
  'Top Reporter': { icon: TrendingUp, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
  'Biodiversity Expert': { icon: Leaf, color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' },
  'Air Quality Specialist': { icon: Wind, color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400' },
};

const expertiseOptions = ['Air Quality', 'Water Quality', 'Biodiversity', 'Noise Pollution', 'Climate', 'Urban Ecology'];

export default function Profile() {
  const { theme, toggleTheme } = useTheme();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    base44.auth.me()
      .then(u => {
        if (u) setUser(u);
        else setUser({ email: 'guest@ecowatch.org', full_name: 'Guest Contributor' });
      })
      .catch(() => {
        setUser({ email: 'guest@ecowatch.org', full_name: 'Guest Contributor' });
      });
  }, []);

  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      try {
        const profiles = await base44.entities.UserProfile.filter({ user_email: user.email });
        if (profiles.length > 0) return profiles[0];
        // Create default profile
        return await base44.entities.UserProfile.create({
          user_email: user.email,
          display_name: user.full_name || user.email?.split('@')[0],
          badges: ['First Submission'],
          expertise: [],
          notification_preferences: { critical_alerts: true, new_observations: false, weekly_digest: true }
        });
      } catch (err) {
        console.error('Profile fetch error:', err);
        return {
          id: 'guest-id',
          user_email: user.email,
          display_name: 'Guest Contributor',
          location: 'New Delhi, India',
          bio: 'Passionate about citizen science and environmental monitoring.',
          badges: ['First Submission'],
          expertise: ['Air Quality', 'Urban Ecology'],
          notification_preferences: { critical_alerts: true, new_observations: false, weekly_digest: true }
        };
      }
    },
    enabled: !!user?.email
  });

  const profile = profileData || (user?.email ? {
    id: 'loading-id',
    user_email: user.email,
    display_name: 'Loading...',
    badges: [],
    expertise: []
  } : null);

  const { data: myObservations } = useQuery({
    queryKey: ['myObservations', user?.email],
    queryFn: () => base44.entities.Observation.filter({ created_by: user.email }),
    enabled: !!user?.email,
    initialData: []
  });

  useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  const saveMutation = useMutation({
    mutationFn: (data) => data.id === 'guest-id' ? Promise.resolve(data) : base44.entities.UserProfile.update(profile.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['userProfile']);
      setEditing(false);
    }
  });

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, avatar_url: file_url }));
    } catch (err) {
      console.error('Upload error:', err);
    }
    setIsUploading(false);
  };

  const toggleExpertise = (skill) => {
    const current = formData.expertise || [];
    setFormData(prev => ({
      ...prev,
      expertise: current.includes(skill) ? current.filter(s => s !== skill) : [...current, skill]
    }));
  };

  const myStats = {
    total: myObservations.length,
    validated: myObservations.filter(o => o.status === 'validated').length,
    flagged: myObservations.filter(o => o.status === 'flagged').length,
    avgConfidence: myObservations.filter(o => o.confidence_score).length > 0
      ? Math.round(myObservations.filter(o => o.confidence_score).reduce((s, o) => s + o.confidence_score, 0) / myObservations.filter(o => o.confidence_score).length)
      : 0
  };

  if (!user || isProfileLoading || !profile || profile.id === 'loading-id') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950/20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Profile</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your account, preferences, and contributions</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Avatar & Stats */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="dark:bg-slate-900 dark:border-slate-700 overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-teal-500 to-teal-600" />
              <CardContent className="pt-0 pb-6">
                <div className="flex flex-col items-center -mt-12">
                  <div className="relative group">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="Avatar" className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-900 object-cover shadow-lg" />
                    ) : (
                      <div className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-900 bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg">
                        <span className="text-white text-2xl font-bold">
                          {(profile.display_name || user?.email || 'U')[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    {editing && (
                      <label className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                        <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                        {isUploading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Camera className="w-5 h-5 text-white" />}
                      </label>
                    )}
                  </div>
                  <h2 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">{profile.display_name}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> {user?.email}
                  </p>
                  {profile.location && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5" /> {profile.location}
                    </p>
                  )}
                  {profile.bio && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-3 leading-relaxed">{profile.bio}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="dark:bg-slate-900 dark:border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-base dark:text-white">My Contributions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'Total Observations', value: myStats.total, icon: TrendingUp, color: 'text-teal-600' },
                  { label: 'Validated', value: myStats.validated, icon: CheckCircle, color: 'text-emerald-600' },
                  { label: 'Avg AI Confidence', value: `${myStats.avgConfidence}%`, icon: Star, color: 'text-amber-600' }
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${color}`} />
                      <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
                    </div>
                    <span className={`font-bold ${color}`}>{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Badges */}
            <Card className="dark:bg-slate-900 dark:border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-base dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" /> Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(profile.badges || []).map(badge => {
                    const cfg = badgeConfig[badge] || { icon: Award, color: 'bg-slate-100 text-slate-700' };
                    const Icon = cfg.icon;
                    return (
                      <Badge key={badge} className={`${cfg.color} gap-1 py-1`}>
                        <Icon className="w-3 h-3" /> {badge}
                      </Badge>
                    );
                  })}
                  {(!profile.badges || profile.badges.length === 0) && (
                    <p className="text-sm text-slate-500 dark:text-slate-400">Submit observations to earn badges!</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Edit Form + Preferences */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Edit */}
            <Card className="dark:bg-slate-900 dark:border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="dark:text-white">Profile Information</CardTitle>
                  <CardDescription className="dark:text-slate-400">Update your public profile</CardDescription>
                </div>
                {!editing ? (
                  <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="dark:border-slate-600 dark:text-slate-300">
                    <Edit3 className="w-4 h-4 mr-2" /> Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setEditing(false); setFormData(profile); }} className="dark:border-slate-600 dark:text-slate-300">
                      <X className="w-4 h-4 mr-1" /> Cancel
                    </Button>
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={() => saveMutation.mutate(formData)} disabled={saveMutation.isPending}>
                      {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-1" /> Save</>}
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="dark:text-slate-300">Display Name</Label>
                    <Input
                      value={formData.display_name || ''}
                      onChange={e => setFormData(p => ({ ...p, display_name: e.target.value }))}
                      disabled={!editing}
                      className="dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="dark:text-slate-300">Location</Label>
                    <Input
                      value={formData.location || ''}
                      onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                      disabled={!editing}
                      placeholder="City, Country"
                      className="dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="dark:text-slate-300">Bio</Label>
                  <Textarea
                    value={formData.bio || ''}
                    onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))}
                    disabled={!editing}
                    placeholder="Tell the community about yourself..."
                    rows={3}
                    className="dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="dark:text-slate-300">Areas of Expertise</Label>
                  <div className="flex flex-wrap gap-2">
                    {expertiseOptions.map(skill => (
                      <button
                        key={skill}
                        onClick={() => editing && toggleExpertise(skill)}
                        disabled={!editing}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${(formData.expertise || []).includes(skill)
                            ? 'bg-teal-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-teal-50 dark:hover:bg-teal-900/30'
                          } ${!editing && 'cursor-default'}`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="dark:bg-slate-900 dark:border-slate-700">
              <CardHeader className="pb-4">
                <CardTitle className="dark:text-white">Preferences</CardTitle>
                <CardDescription className="dark:text-slate-400">Notification and appearance settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      {theme === 'dark' ? <Moon className="w-4 h-4 text-slate-600 dark:text-slate-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white text-sm">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Toggle app theme</p>
                    </div>
                  </div>
                  <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                </div>

                <Separator className="dark:bg-slate-700" />

                <div>
                  <p className="font-medium text-slate-900 dark:text-white text-sm mb-3 flex items-center gap-2">
                    <Bell className="w-4 h-4" /> Notification Preferences
                  </p>
                  <div className="space-y-3">
                    {[
                      { key: 'critical_alerts', label: 'Critical Alerts', desc: 'Immediate alerts for critical severity' },
                      { key: 'new_observations', label: 'New Observations', desc: 'When new data is submitted nearby' },
                      { key: 'weekly_digest', label: 'Weekly Digest', desc: 'Summary of environmental trends' }
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
                        </div>
                        <Switch
                          checked={formData.notification_preferences?.[key] ?? true}
                          onCheckedChange={(checked) => {
                            const updated = { ...formData, notification_preferences: { ...formData.notification_preferences, [key]: checked } };
                            setFormData(updated);
                            saveMutation.mutate(updated);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            {myObservations.length > 0 && (
              <Card className="dark:bg-slate-900 dark:border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base dark:text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {myObservations.slice(0, 5).map(obs => (
                      <div key={obs.id} className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${obs.type === 'air_quality' ? 'bg-sky-500' :
                            obs.type === 'water_quality' ? 'bg-blue-500' :
                              obs.type === 'biodiversity' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}>
                          {obs.type?.[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{obs.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{format(new Date(obs.created_date), 'MMM d, yyyy')}</p>
                        </div>
                        <Badge className={`text-xs ${obs.status === 'validated' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : obs.status === 'flagged' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                          {obs.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}