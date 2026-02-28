import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '@api/components/lib/AuthContext';
import {
  Wind, Droplets, Leaf, Volume2, Trash2, FlaskConical, Sun, Activity,
  Users, CheckCircle, AlertTriangle, TrendingUp, Bell, Upload, Award,
  Target, MapPin, Camera, HelpCircle, ChevronRight
} from 'lucide-react';
import StatsCard from '@api/components/dashboard/StatsCard';
import RecentObservations from '@api/components/dashboard/RecentObservations';
import TrendChart from '@api/components/dashboard/TrendChart';
import TypeDistribution from '@api/components/dashboard/TypeDistribution';
import SoundAnalyticCard from '@api/components/dashboard/SoundAnalyticCard';
import PublicContributorsLeaderboard from '@api/components/dashboard/PublicContributorsLeaderboard';
import { Skeleton } from '@api/components/ui/skeleton';
import MissionProgress from '@api/components/dashboard/MissionProgress';
import Leaderboard from '@api/components/dashboard/Leaderboard';
import { generateDummyObservations } from '@/api/constants/dummyData';
import { Button } from '@api/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@api/components/ui/card';
import PublicDataSubmission from '@api/components/pages/PublicDataSubmission';

export default function Dashboard() {
  const { user, isPublicAccess } = useAuth();
  const { data: apiData, isLoading } = useQuery({
    queryKey: ['observations'],
    queryFn: () => base44.entities.Observation.list('-created_date', 100),
    initialData: []
  });

  const [publicStats, setPublicStats] = React.useState({
    total: 0,
    validated: 0,
    pending: 0,
    impact: 0
  });

  // Load public submission stats
  React.useEffect(() => {
    if (isPublicAccess && user?.id) {
      const stored = localStorage.getItem(`submissions_${user.id}`);
      if (stored) {
        try {
          const submissions = JSON.parse(stored);
          setPublicStats({
            total: submissions.length,
            validated: submissions.filter(s => s.status === 'validated').length,
            pending: submissions.filter(s => s.status === 'pending').length,
            impact: submissions.filter(s => s.status === 'validated').length * 10
          });
        } catch (e) {
          // Handle error
        }
      }
    }
  }, [isPublicAccess, user?.id]);

  const observations = React.useMemo(() => {
    return (apiData && apiData.length > 0) ? apiData : generateDummyObservations();
  }, [apiData]);

  const stats = React.useMemo(() => ({
    total: observations.length,
    validated: observations.filter(o => o.status === 'validated').length,
    pending: observations.filter(o => o.status === 'pending').length,
    flagged: observations.filter(o => o.status === 'flagged').length,
    types: {
      air: observations.filter(o => o.type === 'air_quality').length,
      water: observations.filter(o => o.type === 'water_quality').length,
      biodiversity: observations.filter(o => o.type === 'biodiversity').length,
      noise: observations.filter(o => o.type === 'noise_level').length,
      waste: observations.filter(o => o.type === 'waste').length,
      soil: observations.filter(o => o.type === 'soil_quality').length,
      weather: observations.filter(o => o.type === 'weather').length,
      radiation: observations.filter(o => o.type === 'radiation').length,
      acoustic: observations.filter(o => o.type === 'acoustic').length
    }
  }), [observations]);

  const typeStatsConfigs = [
    { label: 'Air Quality', count: stats.types.air, icon: Wind, gradient: 'from-sky-500 to-sky-600' },
    { label: 'Water Quality', count: stats.types.water, icon: Droplets, gradient: 'from-blue-500 to-blue-600' },
    { label: 'Biodiversity', count: stats.types.biodiversity, icon: Leaf, gradient: 'from-emerald-500 to-emerald-600' },
    { label: 'Noise Level', count: stats.types.noise, icon: Volume2, gradient: 'from-orange-500 to-orange-600' },
    { label: 'Waste Mgmt', count: stats.types.waste, icon: Trash2, gradient: 'from-violet-500 to-violet-600' },
    { label: 'Soil Quality', count: stats.types.soil, icon: FlaskConical, gradient: 'from-stone-500 to-stone-600' },
    { label: 'Weather', count: stats.types.weather, icon: Sun, gradient: 'from-indigo-500 to-indigo-600' },
    { id: 'radiation', label: 'Radiation', count: stats.types.radiation, icon: Activity, gradient: 'from-rose-500 to-rose-600' }
  ];

  // Public User Dashboard: Show only the data submission interface as the primary view
  if (isPublicAccess) {
    return <PublicDataSubmission />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-2 italic uppercase">Dashboard</h1>
          <p className="text-lg text-slate-500 font-bold italic tracking-tight">Real-time environmental monitoring powered by citizen science</p>
        </motion.div>

        {/* Year-One Mission Banner (The Screenshot Target) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2.5rem] p-10 mb-10 shadow-2xl shadow-emerald-900/10 text-white"
        >
          {/* Background Decorative Rings */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full -ml-24 -mb-24 blur-2xl" />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30 shadow-xl">
                  <div className="w-8 h-8 rounded-full border-2 border-white/60 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full border-2 border-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-black tracking-tighter mb-1 uppercase italic">Year-One Mission: 10,000 Observations</h2>
                  <p className="text-emerald-50 text-base font-bold italic tracking-wide opacity-80">Aggregate · Validate · Visualize · Share</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-6xl font-black tracking-tighter italic leading-none mb-1">{Math.floor((stats.total / 10000) * 100)}%</div>
                <p className="text-xs font-black uppercase tracking-widest text-emerald-100">{10000 - stats.total} remaining</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-12">
              <div className="h-4 w-full bg-black/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.total / 10000) * 100}%` }}
                  className="h-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                />
              </div>
              <div className="flex justify-between mt-3 text-[10px] font-black uppercase tracking-widest text-emerald-100/80">
                <span>24 collected</span>
                <span>Goal: 10,000</span>
              </div>
            </div>

            {/* 6-Pillar Grid (Matches Screenshot) */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              {[
                { label: 'Air Quality', icon: Wind, desc: 'PM2.5, AQI & pollutant readings' },
                { label: 'Water Samples', icon: Droplets, desc: 'pH, turbidity & contaminants' },
                { label: 'Biodiversity', icon: Leaf, desc: 'Species sightings & habitat data' },
                { label: 'ML Validation', icon: Award, desc: 'Outlier detection & confidence scoring', active: true },
                { label: 'Public Dashboards', icon: TrendingUp, desc: 'Open visualizations & trend maps' },
                { label: 'Open API', icon: Users, desc: 'Share datasets with researchers' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.15)' }}
                  className={`flex flex-col items-center justify-center text-center p-6 rounded-[2rem] border transition-all cursor-pointer ${item.active ? 'bg-white/15 border-white/20' : 'bg-white/10 border-white/10'
                    }`}
                >
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <item.icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-sm font-black tracking-tighter mb-1 uppercase italic">{item.label}</h3>
                  <p className="text-[10px] font-bold text-emerald-50/70 leading-tight">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Notification Bell Spacer */}
        <div className="flex justify-end -mb-8 relative z-20 px-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-12 h-12 bg-white dark:bg-slate-900 rounded-full shadow-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-center cursor-pointer group"
          >
            <Bell className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            <div className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
          </motion.div>
        </div>

        {/* Stats Row (Matches Screenshot Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Observations */}
          <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-emerald-50 dark:bg-emerald-950/20 rounded-full group-hover:scale-110 transition-transform" />
            <div className="relative z-10 flex justify-between items-start">
              <div className="space-y-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Total Observations</p>
                <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">{stats.total}</p>
                <div className="flex items-center gap-2 text-emerald-500">
                  <span className="text-sm font-black italic">↑ 12%</span>
                  <span className="text-xs font-bold text-slate-400 italic">vs last week</span>
                </div>
              </div>
              <div className="p-4 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-200 dark:shadow-none">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Validated */}
          <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-emerald-50 dark:bg-emerald-950/20 rounded-full group-hover:scale-110 transition-transform" />
            <div className="relative z-10 flex justify-between items-start">
              <div className="space-y-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Validated</p>
                <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">{stats.validated}</p>
                <p className="text-xs font-bold text-slate-400 italic">{Math.round((stats.validated / stats.total) * 100)}% validation rate</p>
              </div>
              <div className="p-4 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-200 dark:shadow-none">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Pending Review */}
          <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-amber-50 dark:bg-amber-950/20 rounded-full group-hover:scale-110 transition-transform" />
            <div className="relative z-10 flex justify-between items-start">
              <div className="space-y-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Pending Review</p>
                <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">{stats.pending}</p>
              </div>
              <div className="p-4 bg-amber-500 rounded-2xl shadow-lg shadow-amber-200 dark:shadow-none">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Flagged */}
          <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-rose-50 dark:bg-rose-950/20 rounded-full group-hover:scale-110 transition-transform" />
            <div className="relative z-10 flex justify-between items-start">
              <div className="space-y-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Flagged</p>
                <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">{stats.flagged}</p>
              </div>
              <div className="p-4 bg-rose-500 rounded-2xl shadow-lg shadow-rose-200 dark:shadow-none">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Category Grid (Matches Screenshot 3x3 Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            { label: 'Air Quality', count: stats.types.air, icon: Wind, color: 'text-blue-500', bgColor: 'bg-blue-50' },
            { label: 'Water Quality', count: stats.types.water, icon: Droplets, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
            { label: 'Biodiversity', count: stats.types.biodiversity, icon: Leaf, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
            { label: 'Noise Level', count: stats.types.noise, icon: Volume2, color: 'text-amber-600', bgColor: 'bg-amber-50' },
            { label: 'Waste', count: stats.types.waste, icon: Trash2, color: 'text-rose-600', bgColor: 'bg-rose-50' },
            { label: 'Soil Quality', count: stats.types.soil, icon: FlaskConical, color: 'text-slate-600', bgColor: 'bg-slate-100' },
            { label: 'Weather', count: stats.types.weather, icon: Sun, color: 'text-orange-500', bgColor: 'bg-orange-50' },
            { label: 'Radiation', count: stats.types.radiation, icon: Activity, color: 'text-pink-600', bgColor: 'bg-pink-50' },
            { label: 'Bio-Acoustics', count: stats.types.acoustic, icon: Volume2, color: 'text-indigo-600', bgColor: 'bg-indigo-50', path: 'AcousticVault' },
          ].map((cat, i) => (
            <motion.div
              key={cat.label}
              whileHover={{ y: -5, shadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
              onClick={() => cat.path && (window.location.href = createPageUrl(cat.path))}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 transition-all cursor-pointer group"
            >
              <div className={`w-24 h-24 ${cat.bgColor} dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <cat.icon className={`w-10 h-10 ${cat.color}`} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight italic uppercase mb-2">{cat.label}</h3>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-400 italic">Total Data:</p>
                <span className={`px-3 py-0.5 rounded-full text-xs font-black uppercase text-white ${cat.color.replace('text', 'bg')}`}>{cat.count}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section (From Screenshot) */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                <CardHeader className="px-8 pt-8">
                  <CardTitle className="text-2xl font-black tracking-tight text-slate-900 italic uppercase">Submission Trends</CardTitle>
                  <CardDescription className="font-bold italic text-slate-400">Observations over the last 7 days</CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <TrendChart observations={observations} />
                </CardContent>
              </Card>
            </motion.div>
          </div>
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white h-full">
                <CardHeader className="px-8 pt-8">
                  <CardTitle className="text-2xl font-black tracking-tight text-slate-900 italic uppercase">Data Distribution</CardTitle>
                  <CardDescription className="font-bold italic text-slate-400">Observations by type</CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8 flex flex-col items-center justify-center">
                  <TypeDistribution observations={observations} />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* AI Acoustic Analysis (New Feature) */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1">
            <SoundAnalyticCard />
          </div>
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-indigo-600 to-indigo-800 text-white h-full">
                <CardContent className="p-10 flex flex-col justify-center h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                      <Volume2 className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-black italic uppercase italic">AcousticVault Powered</h3>
                  </div>
                  <p className="text-indigo-100 text-lg font-bold italic mb-6">
                    Our edge-AI models are currently monitoring local soundscapes for biodiversity indicators and industrial anomalies.
                  </p>
                  <Link to={createPageUrl('AcousticVault')}>
                    <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full font-black uppercase italic tracking-widest text-xs py-6 px-10">
                      Open Analysis Suite <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Recent Observations (From Screenshot) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="px-8 pt-8">
              <CardTitle className="text-2xl font-black tracking-tight text-slate-900 italic uppercase">Recent Observations</CardTitle>
              <CardDescription className="font-bold italic text-slate-400">Latest citizen science submissions</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <RecentObservations observations={observations} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
