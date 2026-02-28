import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Shield, AlertTriangle, CheckCircle, Info, Volume2 } from 'lucide-react';
import { Card, CardContent } from '@api/components/ui/card';
import { Badge } from '@api/components/ui/badge';

export default function SoundAnalyticCard({ data: initialData, isLoading: initialLoading }) {
    const [data, setData] = React.useState(initialData);
    const [isLoading, setIsLoading] = React.useState(initialLoading);

    React.useEffect(() => {
        if (initialData) {
            setData(initialData);
            setIsLoading(initialLoading);
            return;
        }

        const fetchLatest = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:8000/history');
                if (response.ok) {
                    const history = await response.json();
                    if (history.length > 0) {
                        // Get last item from history
                        const last = history[history.length - 1];
                        // Since history logs are simplified, we might need a full fetch for details
                        // but for now we'll just use the history data
                        setData({
                            ...last,
                            details: `Latest detected sound: ${last.label}. Risk level: ${last.risk_level || 'Low'}.`,
                            risk_level: last.risk_level || (last.confidence > 0.9 ? 'Low' : 'Moderate')
                        });
                    }
                }
            } catch (err) {
                console.log('Failed to fetch latest acoustic data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLatest();
        // Poll every 10 seconds for dashboard updates
        const interval = setInterval(fetchLatest, 10000);
        return () => clearInterval(interval);
    }, [initialData, initialLoading]);

    if (isLoading && !data) {
        return (
            <Card className="bg-white dark:bg-slate-900 border-0 shadow-xl rounded-[2rem] overflow-hidden animate-pulse">
                <CardContent className="p-8">
                    <div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded mb-4" />
                    <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded mb-6" />
                    <div className="space-y-3">
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded" />
                        <div className="h-2 w-2/3 bg-slate-100 dark:bg-slate-800 rounded" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    const { label, confidence, risk_level, details, timestamp } = data || {
        label: "Background Ambient",
        confidence: 0.92,
        risk_level: "Low",
        details: "Normal acoustic environment detected.",
        timestamp: new Date().toISOString()
    };

    const getRiskColor = (risk) => {
        switch (risk.toLowerCase()) {
            case 'high': return 'bg-rose-500';
            case 'moderate': return 'bg-amber-500';
            default: return 'bg-emerald-500';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-full"
        >
            <Card className="bg-white dark:bg-slate-900 border-0 shadow-xl rounded-[2.5rem] overflow-hidden group h-full relative">
                {/* Background Accent */}
                <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 ${getRiskColor(risk_level)}`} />

                <CardContent className="p-8 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                            <Volume2 className="w-6 h-6 text-indigo-500" />
                        </div>
                        <Badge className={`${getRiskColor(risk_level)} text-white border-0 py-1 px-4 font-black uppercase italic tracking-widest`}>
                            {risk_level} Risk
                        </Badge>
                    </div>

                    <div className="mb-6 flex-1">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic mb-2">Live AI Classification</p>
                        <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase mb-2">{label}</h3>
                        <p className="text-sm font-bold text-slate-400 italic leading-tight">{details}</p>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-slate-50 dark:border-slate-800">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Prediction Confidence</span>
                                <span className="text-xs font-black text-indigo-600 italic">{(confidence * 100).toFixed(1)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${confidence * 100}%` }}
                                    className="h-full bg-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 italic">
                            <Activity className="w-3 h-3" />
                            <span>Last Detected: {new Date(timestamp).toLocaleTimeString()}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
