import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@api/components/lib/AuthContext';
import SubmissionForm from '@api/components/submission/SubmissionForm';
import PublicContributorsLeaderboard from '@api/components/dashboard/PublicContributorsLeaderboard';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from "@/lib/utils";
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@api/components/ui/card';
import { Button } from '@api/components/ui/button';
import { Badge } from '@api/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@api/components/ui/tabs';
import { generateDummyObservations } from '@/api/constants/dummyData';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Upload, TrendingUp, Award, Users, Zap, CheckCircle, AlertCircle,
  Info, Heart, Target, Lightbulb, Share2, MapPin, Globe
} from 'lucide-react';

export default function PublicDataSubmission() {
  const { user, isPublicAccess } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('submit');

  const { data: apiData } = useQuery({
    queryKey: ['observations'],
    queryFn: () => base44.entities.Observation.list('-created_date', 100),
    initialData: []
  });

  const globalObservations = useMemo(() => {
    return (apiData && apiData.length > 0) ? apiData : generateDummyObservations();
  }, [apiData]);

  const globalCount = globalObservations.length;

  const [submissions, setSubmissions] = useState(() => {
    const stored = localStorage.getItem(`submissions_${user?.id}`);
    return stored ? JSON.parse(stored) : [];
  });
  const [stats, setStats] = useState({
    total: 0,
    validated: 0,
    pending: 0,
    impact: 0
  });

  useEffect(() => {
    calculateStats();
  }, [submissions]);

  const calculateStats = () => {
    const stats = {
      total: submissions.length,
      validated: submissions.filter(s => s.status === 'validated').length,
      pending: submissions.filter(s => s.status === 'pending').length,
      impact: submissions.filter(s => s.status === 'validated').length * 10
    };
    setStats(stats);
  };

  const handleSuccess = (submissionData) => {
    const newSubmission = {
      id: Date.now(),
      ...submissionData,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      userName: user?.name || 'Guest User'
    };

    const updatedSubmissions = [newSubmission, ...submissions];
    setSubmissions(updatedSubmissions);
    localStorage.setItem(`submissions_${user?.id}`, JSON.stringify(updatedSubmissions));

    setActiveTab('history');
  };

  const removeSubmission = (id) => {
    const updatedSubmissions = submissions.filter(s => s.id !== id);
    setSubmissions(updatedSubmissions);
    localStorage.setItem(`submissions_${user?.id}`, JSON.stringify(updatedSubmissions));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-black mb-2">Environmental Observer</h1>
            <p className="text-emerald-50 text-lg">Submit observations and contribute to global science</p>
            <p className="text-emerald-100 text-sm mt-2">Welcome, {user?.name || 'Guest Observer'}! Your data helps us understand Earth's health.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="border-0 shadow-lg bg-emerald-600 text-white hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-semibold italic uppercase">Global Observations</p>
                  <p className="text-3xl font-black mt-2">{globalCount}</p>
                </div>
                <Globe className="w-10 h-10 text-emerald-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-semibold">Your Submissions</p>
                  <p className="text-3xl font-black text-slate-900 mt-2">{stats.total}</p>
                </div>
                <Upload className="w-10 h-10 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-semibold">Validated</p>
                  <p className="text-3xl font-black text-emerald-600 mt-2">{stats.validated}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-semibold">Pending Review</p>
                  <p className="text-3xl font-black text-amber-600 mt-2">{stats.pending}</p>
                </div>
                <Lightbulb className="w-10 h-10 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-50 text-sm font-semibold">Impact Score</p>
                  <p className="text-3xl font-black mt-2">{stats.impact}</p>
                </div>
                <Zap className="w-10 h-10 text-emerald-100" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-100">
            <TabsTrigger value="submit" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Submit Data
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              My Submissions
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Community
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              Guides
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Achievements
            </TabsTrigger>
          </TabsList>

          {/* Submit Tab */}
          <TabsContent value="submit" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-6 h-6 text-emerald-600" />
                    Submit Your Observation
                  </CardTitle>
                  <CardDescription>
                    Contribute valuable environmental data to our global network
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SubmissionForm onSuccess={handleSuccess} />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {submissions.length === 0 ? (
                <Card className="border-2 border-dashed border-slate-300 bg-slate-50">
                  <CardContent className="pt-12 pb-12 text-center">
                    <Upload className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Submissions Yet</h3>
                    <p className="text-slate-600 mb-6">Start by submitting your first observation</p>
                    <Button
                      onClick={() => setActiveTab('submit')}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Submit Your First Data
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {submissions.map((submission, index) => (
                    <motion.div
                      key={submission.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-l-4 border-l-emerald-500 hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-bold text-slate-900 text-lg">{submission.title || submission.category}</h4>
                                <Badge
                                  className={`${submission.status === 'validated'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : submission.status === 'pending'
                                        ? 'bg-amber-100 text-amber-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                  {submission.status === 'validated' && <CheckCircle className="w-3 h-3 mr-1" />}
                                  {submission.status === 'pending' && <AlertCircle className="w-3 h-3 mr-1" />}
                                  {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-slate-600 text-sm mb-3">{submission.notes || 'No additional notes'}</p>
                              <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {submission.location_name || `${submission.latitude}, ${submission.longitude}`}
                                </div>
                                <div>
                                  📅 {new Date(submission.submittedAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSubmission(submission.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              Remove
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Guides Tab */}
          <TabsContent value="guides" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {[
                {
                  title: 'Accuracy Matters',
                  icon: Target,
                  description: 'Use GPS for precise location data. Manual locations are helpful too.',
                  tips: ['Enable location services', 'Double-check coordinates', 'Include landmarks']
                },
                {
                  title: 'Quality Data',
                  icon: Heart,
                  description: 'Provide detailed observations with supporting photos or measurements.',
                  tips: ['Take clear photos', 'Measure when possible', 'Note time of day']
                },
                {
                  title: 'Validation Process',
                  icon: CheckCircle,
                  description: 'Our AI system validates submissions and flags unusual patterns.',
                  tips: ['Write clear descriptions', 'Include relevant context', 'Be honest & detailed']
                },
                {
                  title: 'Community Impact',
                  icon: Users,
                  description: 'Your observations help scientists and policymakers protect our environment.',
                  tips: ['Consistent monitoring', 'Share findings', 'Invite others']
                }
              ].map((guide, index) => {
                const Icon = guide.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-emerald-600">
                          <Icon className="w-6 h-6" />
                          {guide.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-slate-600">{guide.description}</p>
                        <ul className="space-y-2">
                          {guide.tips.map((tip, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    name: 'First Observer',
                    description: 'Submit your first observation',
                    icon: '🌱',
                    unlocked: stats.total >= 1
                  },
                  {
                    name: 'Rising Contributor',
                    description: 'Submit 5 observations',
                    icon: '📈',
                    unlocked: stats.total >= 5
                  },
                  {
                    name: 'Data Champion',
                    description: 'Get 3 observations validated',
                    icon: '⭐',
                    unlocked: stats.validated >= 3
                  },
                  {
                    name: 'Dedicated Observer',
                    description: 'Submit 10 observations',
                    icon: '🎯',
                    unlocked: stats.total >= 10
                  },
                  {
                    name: 'Validation Master',
                    description: 'Get 10 observations validated',
                    icon: '✨',
                    unlocked: stats.validated >= 10
                  },
                  {
                    name: 'Environmental Guardian',
                    description: 'Achieve 50+ impact score',
                    icon: '🌍',
                    unlocked: stats.impact >= 50
                  }
                ].map((badge, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`border-0 transition-all ${badge.unlocked ? 'shadow-lg hover:shadow-xl bg-gradient-to-br from-emerald-50 to-teal-50' : 'shadow-sm bg-slate-50 opacity-60'}`}>
                      <CardContent className="pt-8 text-center">
                        <div className="text-5xl mb-3">{badge.icon}</div>
                        <h4 className="font-bold text-slate-900 mb-1">{badge.name}</h4>
                        <p className="text-sm text-slate-600 mb-4">{badge.description}</p>
                        {badge.unlocked ? (
                          <Badge className="bg-emerald-600">Unlocked ✓</Badge>
                        ) : (
                          <Badge variant="outline" className="text-slate-500">Locked</Badge>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Call to Action Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 p-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl text-white text-center"
        >
          <h3 className="text-2xl font-black mb-3">Ready to Make an Impact?</h3>
          <p className="mb-6 text-emerald-50 max-w-2xl mx-auto">
            Every observation you submit helps scientists understand and protect our environment.
            Together, we're building a real-time database of Earth's health.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={() => setActiveTab('submit')}
              className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold"
            >
              Submit New Data
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/20"
            >
              Share Results
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
