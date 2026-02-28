import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, User, Flame, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@api/components/ui/card';

const contributors = [
    { name: 'Aarav Sharma', points: 1450, observations: 42, rank: 1, avatar: 'AS', trend: 'up' },
    { name: 'Priya Patel', points: 1280, observations: 38, rank: 2, avatar: 'PP', trend: 'up' },
    { name: 'Ishan Verma', points: 950, observations: 24, rank: 3, avatar: 'IV', trend: 'down' },
    { name: 'Ananya Iyer', points: 820, observations: 19, rank: 4, avatar: 'AI', trend: 'stable' },
    { name: 'Siddharth Rao', points: 740, observations: 15, rank: 5, avatar: 'SR', trend: 'up' }
];

export default function Leaderboard() {
    return (
        <Card className="border-0 shadow-none bg-slate-50/50 dark:bg-slate-900/50 h-full">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-amber-500" />
                            Community Leaders
                        </CardTitle>
                        <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
                            Top Contributors this month
                        </CardDescription>
                    </div>
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200" />
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {contributors.map((user, index) => {
                        const isTop3 = user.rank <= 3;
                        const RankIcon = user.rank === 1 ? Trophy : user.rank === 2 ? Medal : Award;

                        return (
                            <motion.div
                                key={user.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className={`flex items-center gap-4 p-4 rounded-3xl transition-all ${index === 0
                                        ? 'bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200/50 dark:border-amber-900/30 shadow-lg shadow-amber-500/5'
                                        : 'bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50'
                                    }`}
                            >
                                <div className="relative">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${user.rank === 1 ? 'bg-amber-100 text-amber-700' :
                                            user.rank === 2 ? 'bg-slate-100 text-slate-700' :
                                                user.rank === 3 ? 'bg-orange-100 text-orange-700' :
                                                    'bg-slate-50 text-slate-400'
                                        }`}>
                                        {user.avatar}
                                    </div>
                                    {isTop3 && (
                                        <div className="absolute -top-2 -right-2">
                                            <RankIcon className={`w-5 h-5 ${user.rank === 1 ? 'text-amber-500' :
                                                    user.rank === 2 ? 'text-slate-400' :
                                                        'text-orange-500'
                                                }`} />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="font-black text-slate-900 dark:text-white truncate">{user.name}</h4>
                                    <div className="flex items-center gap-3 mt-0.5">
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                            <Award className="w-3 h-3" /> {user.points} pts
                                        </span>
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                            <User className="w-3 h-3" /> {user.observations} obs
                                        </span>
                                    </div>
                                </div>

                                <div className="text-right">
                                    {user.trend === 'up' && <Flame className="w-4 h-4 text-rose-500 animate-pulse ml-auto" />}
                                    {user.trend === 'stable' && <TrendingUp className="w-4 h-4 text-teal-500 ml-auto opacity-50" />}
                                    <p className="text-[10px] font-black text-slate-300 mt-1">RANK #{user.rank}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <button className="w-full mt-6 py-3 px-4 bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-300 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
                    View Full Leaderboard
                </button>
            </CardContent>
        </Card>
    );
}
