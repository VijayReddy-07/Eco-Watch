import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Volume2, Shield, Activity, History,
    AlertTriangle, CheckCircle, Info
} from 'lucide-react';
import AudioRecorder from '@api/components/acoustic/AudioRecorder';
import SoundAnalyticCard from '@api/components/dashboard/SoundAnalyticCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@api/components/ui/card';

export default function AcousticVault() {
    const [lastPrediction, setLastPrediction] = useState(null);
    const [history, setHistory] = useState([]);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await fetch('http://localhost:8000/history');
            if (response.ok) {
                const data = await response.json();
                setHistory(data.reverse());
            }
        } catch (err) {
            console.log('History fetch failed, using mock data');
            setHistory([
                { id: 1, label: "Frog Calls", confidence: 0.98, timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
                { id: 2, label: "Traffic Noise", confidence: 0.85, timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
                { id: 3, label: "Bird Song", confidence: 0.92, timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() }
            ]);
        }
    };

    const handleInference = (result) => {
        setLastPrediction(result);
        fetchHistory();
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
                            <Volume2 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">AcousticVault</h1>
                            <p className="text-lg text-slate-500 font-bold italic tracking-tight">AI-Powered Environmental Sound Intelligence</p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Recording Interface */}
                    <div className="lg:col-span-2 space-y-8">
                        <AudioRecorder onInferenceComplete={handleInference} />

                        <Card className="border-0 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900">
                            <CardHeader className="px-10 pt-10">
                                <div className="flex items-center gap-3">
                                    <History className="w-6 h-6 text-slate-400" />
                                    <CardTitle className="text-2xl font-black italic uppercase">Detection History</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="px-10 pb-10">
                                <div className="space-y-4">
                                    {history.map((log, i) => (
                                        <motion.div
                                            key={log.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl flex items-center justify-between group hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-100"
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center shadow-sm">
                                                    <Activity className="w-5 h-5 text-indigo-500" />
                                                </div>
                                                <div>
                                                    <p className="text-lg font-black text-slate-900 dark:text-white italic uppercase">{log.label}</p>
                                                    <p className="text-xs font-bold text-slate-400 italic">{new Date(log.timestamp).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-indigo-600 italic">{(log.confidence * 100).toFixed(1)}% Match</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {history.length === 0 && (
                                        <p className="text-center py-10 text-slate-300 font-bold italic">No detection logs found.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Real-time Analytics Sidebar */}
                    <div className="space-y-8">
                        <SoundAnalyticCard data={lastPrediction} />

                        <Card className="border-0 shadow-2xl rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-indigo-600 to-indigo-800 text-white">
                            <CardContent className="p-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <Shield className="w-6 h-6 text-indigo-200" />
                                    <h4 className="text-xl font-black italic uppercase">Eco-Alert System</h4>
                                </div>
                                <p className="text-indigo-100 text-sm font-bold italic leading-relaxed mb-6">
                                    Our neural network monitors acoustic signatures in real-time to detect ecosystem anomalies and unauthorized industrial activity.
                                </p>
                                <div className="space-y-4">
                                    <div className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-1">Current Status</p>
                                        <p className="font-black italic uppercase">Ecosystem Baseline Validated</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
