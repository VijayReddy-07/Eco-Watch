import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@api/components/ui/card';
import { Badge } from '@api/components/ui/badge';
import { motion } from 'framer-motion';
import { Trophy, Users, Zap } from 'lucide-react';

export default function PublicContributorsLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Get all public contributor data from localStorage
    const allKeys = Object.keys(localStorage);
    const submissionKeys = allKeys.filter(key => key.startsWith('submissions_public_user_'));
    
    const contributorStats = {};
    
    submissionKeys.forEach(key => {
      const userId = key.replace('submissions_', '');
      try {
        const submissions = JSON.parse(localStorage.getItem(key));
        const userName = submissions[0]?.userName || userId.replace('public_user_', 'Observer');
        const validated = submissions.filter(s => s.status === 'validated').length;
        
        contributorStats[userId] = {
          userName,
          total: submissions.length,
          validated,
          impact: validated * 10
        };
      } catch (e) {
        // Skip invalid data
      }
    });
    
    // Sort by impact score
    const sorted = Object.values(contributorStats)
      .sort((a, b) => b.impact - a.impact)
      .slice(0, 10);
    
    setLeaderboard(sorted);
  }, []);

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-emerald-50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-emerald-600">
          <Trophy className="w-6 h-6" />
          Public Contributors
        </CardTitle>
        <CardDescription>
          Top observers contributing to environmental science
        </CardDescription>
      </CardHeader>
      <CardContent>
        {leaderboard.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No public submissions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((contributor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md transition-shadow border border-slate-100"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-white ${
                    index === 0 ? 'bg-amber-500' : 
                    index === 1 ? 'bg-slate-400' : 
                    index === 2 ? 'bg-amber-700' :
                    'bg-emerald-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{contributor.userName}</p>
                    <p className="text-xs text-slate-500">{contributor.total} submissions</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span className="font-black text-slate-900">{contributor.impact}</span>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800 text-xs mt-1">
                      {contributor.validated} validated
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
