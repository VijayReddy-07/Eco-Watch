import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquarePlus, X, Send, Bug, Lightbulb, Heart,
    ShieldAlert, Radio, Mail, Globe, CheckCircle2,
    Hash, Clock, ArrowRight, ArrowLeft
} from 'lucide-react';
import { Button } from '@api/components/ui/button';
import { useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';

const SEVERITIES = [
    { id: 'low', label: 'Low', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'medium', label: 'Medium', color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'high', label: 'High', color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'critical', label: 'Critical', color: 'text-rose-500', bg: 'bg-rose-50' }
];

const CATEGORIES = [
    { id: 'bug', label: 'Bug Report', icon: Bug, color: 'text-rose-500', desc: 'Something isn\'t working correctly' },
    { id: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'text-amber-500', desc: 'Suggest a new idea or improvement' },
    { id: 'general', label: 'General Feedback', icon: MessageSquarePlus, color: 'text-teal-500', desc: 'Share your general thoughts' },
    { id: 'security', label: 'Security Issue', icon: ShieldAlert, color: 'text-indigo-500', desc: 'Private report for vulnerabilities' }
];

export default function FeedbackDialog({ isOpen, onClose }) {
    const location = useLocation();
    const [step, setStep] = useState(1);
    const [type, setType] = useState('bug');
    const [priority, setPriority] = useState('medium');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [ticketId, setTicketId] = useState('');

    const resetForm = () => {
        setStep(1);
        setType('bug');
        setPriority('medium');
        setMessage('');
        setEmail('');
        setIsSuccess(false);
    };

    const handleClose = () => {
        onClose();
        setTimeout(resetForm, 300);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        const id = `ECO-${Math.floor(Math.random() * 90000) + 10000}`;
        setTicketId(id);
        setIsSubmitting(false);
        setIsSuccess(true);

        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#0D9488', '#6366F1', '#F43F5E']
        });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
                >
                    {isSuccess ? (
                        <div className="p-10 text-center">
                            <motion.div
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                            </motion.div>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Submission Received</h2>
                            <p className="text-slate-500 font-medium mb-8">
                                Your report has been logged. Our engineering team will review it shortly.
                            </p>

                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 mb-8 border border-slate-100 dark:border-slate-700/50 flex flex-col items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">REFERENCE TICKET</span>
                                <span className="text-2xl font-black text-slate-900 dark:text-teal-400 font-mono tracking-tighter">{ticketId}</span>
                            </div>

                            <Button onClick={handleClose} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-6 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">
                                Return to Dashboard
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                                        <MessageSquarePlus className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black text-slate-900 dark:text-white leading-none">Professional Feedback</h2>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Enterprise Support Engine</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full">
                                    <X className="w-5 h-5 text-slate-400" />
                                </Button>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-1 flex w-full bg-slate-100 dark:bg-slate-800">
                                <motion.div
                                    initial={{ width: '33%' }}
                                    animate={{ width: step === 1 ? '33.3%' : step === 2 ? '66.6%' : '100%' }}
                                    className="bg-teal-500 h-full"
                                />
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="p-8">
                                    {/* Step 1: Category Selection */}
                                    {step === 1 && (
                                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                            <label className="text-sm font-black text-slate-900 dark:text-slate-300 mb-4 block">What would you like to report?</label>
                                            <div className="grid grid-cols-1 gap-3">
                                                {CATEGORIES.map((cat) => (
                                                    <button
                                                        key={cat.id}
                                                        type="button"
                                                        onClick={() => { setType(cat.id); setStep(2); }}
                                                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${type === cat.id
                                                                ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-900/20'
                                                                : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                                                            }`}
                                                    >
                                                        <div className={`p-3 rounded-xl ${cat.color} bg-white dark:bg-slate-800 shadow-sm`}>
                                                            <cat.icon className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{cat.label}</p>
                                                            <p className="text-xs text-slate-500 font-medium">{cat.desc}</p>
                                                        </div>
                                                        <ArrowRight className="w-4 h-4 text-slate-300" />
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 2: Details & Priority */}
                                    {step === 2 && (
                                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                            <div className="space-y-3">
                                                <label className="text-sm font-black text-slate-900 dark:text-white block uppercase tracking-tighter">Severity Level</label>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {SEVERITIES.map(s => (
                                                        <button
                                                            key={s.id}
                                                            type="button"
                                                            onClick={() => setPriority(s.id)}
                                                            className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${priority === s.id
                                                                    ? `${s.color} ${s.bg} border-current`
                                                                    : 'border-slate-100 dark:border-slate-800 text-slate-400'
                                                                }`}
                                                        >
                                                            {s.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-black text-slate-900 dark:text-white block uppercase tracking-tighter">Details</label>
                                                <textarea
                                                    required
                                                    value={message}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                    placeholder="Describe the situation in detail..."
                                                    className="w-full h-32 px-5 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-transparent focus:border-teal-500 outline-none text-sm transition-all resize-none"
                                                />
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <Button type="button" variant="outline" onClick={() => setStep(1)} className="rounded-xl px-4 text-slate-500">
                                                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                                </Button>
                                                <Button type="button" onClick={() => setStep(3)} disabled={!message} className="flex-1 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-bold py-6">
                                                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 3: Contact & Metadata */}
                                    {step === 3 && (
                                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Automatically Captured Context</p>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <Globe className="w-3 h-3 text-slate-400" />
                                                            <span className="text-[10px] font-bold text-slate-600 truncate">{window.location.host}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Radio className="w-3 h-3 text-slate-400" />
                                                            <span className="text-[10px] font-bold text-slate-600">Page: {location.pathname}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-3 h-3 text-slate-400" />
                                                            <span className="text-[10px] font-bold text-slate-600">{new Date().toLocaleTimeString()}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Hash className="w-3 h-3 text-slate-400" />
                                                            <span className="text-[10px] font-bold text-slate-600 italic">v2.4.0-pro</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-black text-slate-900 dark:text-white block uppercase tracking-tighter">Contact Email (Optional)</label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                        <input
                                                            type="email"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            placeholder="johndoe@example.com"
                                                            className="w-full pl-11 pr-5 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none text-sm transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <Button type="button" variant="outline" onClick={() => setStep(2)} className="rounded-xl px-4 text-slate-500">
                                                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl rounded-2xl font-black uppercase tracking-[0.2em] text-xs h-14"
                                                >
                                                    {isSubmitting ? 'Processing Audit...' : 'Finalize & Submit'}
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Footer Info */}
                                <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ECOWATCH ENTERPRISE</span>
                                    {step > 1 && (
                                        <span className="text-[9px] font-black text-teal-600 uppercase tracking-widest">
                                            Type: {type.replace('_', ' ')} / Priority: {priority}
                                        </span>
                                    )}
                                </div>
                            </form>
                        </>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
