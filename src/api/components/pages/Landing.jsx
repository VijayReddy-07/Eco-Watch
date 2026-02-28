import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/lib/utils';
import {
    Leaf, Globe, ShieldCheck, Users, ArrowRight, Play,
    CheckCircle2, Zap, Layers, BarChart3, Database,
    MessageSquare, ArrowBigUp, Share2
} from 'lucide-react';
import { Button } from '@api/components/ui/button';

const SectionHeader = ({ badge, title, subtitle, centered = false }) => (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
        <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4"
        >
            {badge}
        </motion.span>
        <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4"
        >
            {title}
        </motion.h2>
        <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto"
        >
            {subtitle}
        </motion.p>
    </div>
);

export default function Landing() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 overflow-hidden font-sans">
            {/* Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                            <Database className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tighter uppercase italic">Mechovate</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        {['Methodology', 'Collective', 'Global Network', 'Open API'].map(item => {
                            const url = item === 'Collective' ? createPageUrl('CommunityHub') : '#';
                            const isAnchor = url === '#';
                            return isAnchor ? (
                                <a key={item} href={url} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors uppercase tracking-tight">
                                    {item}
                                </a>
                            ) : (
                                <Link key={item} to={url} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors uppercase tracking-tight">
                                    {item}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to={createPageUrl('PublicLogin')}>
                            <Button className="hidden sm:inline-flex bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-full px-6 py-2 text-xs font-black uppercase tracking-widest transition-transform hover:scale-105 active:scale-95">
                                Public Access
                            </Button>
                        </Link>
                        <Link to={createPageUrl('Dashboard')}>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 py-2 text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-transform hover:scale-105 active:scale-95">
                                Expert Login
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="inline-block px-4 py-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-8 border border-indigo-100 dark:border-indigo-900/50">
                            Live Global Environmental Feed
                        </span>
                        <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mb-8">
                            Bridging the gap between <span className="text-indigo-600">Citizens</span> & <span className="text-indigo-600/60">Scientists.</span>
                        </h1>
                        <p className="text-xl text-slate-500 leading-relaxed mb-10 max-w-xl">
                            Mechovate is the premier planetary data synthesis platform. We leverage hyper-local human observations and satellite telemetry to build a real-time digital twin of Earth's environmental health.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to={createPageUrl('Submit')}>
                                <Button className="h-16 px-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-indigo-600/30 group transition-all hover:scale-105">
                                    Apply as Expert <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link to={createPageUrl('Map')}>
                                <Button variant="outline" className="h-16 px-10 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all">
                                    View Global Map
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-slate-900 bg-slate-900 aspect-video group">
                            <img
                                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
                                alt="Planet Pulse"
                                className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-t from-slate-950 via-transparent to-transparent">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center mb-6 hover:bg-white/30 transition-colors"
                                >
                                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                                </motion.button>
                                <div className="text-center">
                                    <p className="text-xs font-black tracking-widest text-white uppercase mb-1">Planetary Pulse V4.2</p>
                                    <p className="text-[10px] text-white/50 font-bold italic tracking-wide">Global environmental trends synthesis movie</p>
                                </div>
                            </div>
                            <div className="absolute bottom-6 right-6">
                                <span className="px-3 py-1.5 bg-indigo-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">Live Feed</span>
                            </div>
                        </div>

                        {/* Floating Stats Window */}
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="absolute -bottom-10 -left-10 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 z-10"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">14.2k</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Records</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Paths Section */}
            <section className="py-32 px-6 bg-slate-50/50 dark:bg-slate-900/30">
                <div className="max-w-7xl mx-auto">
                    <SectionHeader
                        centered
                        badge="Unified Ecosystem"
                        title="Two Paths, One Collective Mission"
                    />

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Public Citizen Portal */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl"
                        >
                            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900 rounded-2xl flex items-center justify-center mb-8">
                                <Globe className="w-7 h-7 text-indigo-600" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Public Citizen Portal</h3>
                            <ul className="space-y-4 mb-10">
                                {[
                                    'Browse validated environmental data packages freely.',
                                    'Visualize global trends through the Interactive Spatial Monitor.',
                                    'Contribute basic observations for independent ML-assisted verification.'
                                ].map(text => (
                                    <li key={text} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm font-medium text-slate-600">{text}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link to={createPageUrl('Dashboard')}>
                                <Button variant="outline" className="w-full h-14 border-2 border-slate-100 rounded-2xl font-black uppercase tracking-widest text-[10px] text-indigo-600 hover:bg-slate-50">
                                    Access Public Dashboard
                                </Button>
                            </Link>
                        </motion.div>

                        {/* Expert Contributor Hub */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-slate-900 dark:bg-black p-10 rounded-[2.5rem] border border-slate-800 shadow-xl relative overflow-hidden"
                        >
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-emerald-950 rounded-2xl flex items-center justify-center mb-8 border border-emerald-900/50">
                                    <ShieldCheck className="w-7 h-7 text-emerald-500" />
                                </div>
                                <h3 className="text-3xl font-black text-white mb-6 tracking-tight">Expert Contributor Hub</h3>
                                <ul className="space-y-4 mb-10">
                                    {[
                                        'High-trust contribution rights with priority data discovery.',
                                        'Access to Human-In-The-Loop (HITL) validation interface.',
                                        'Advanced satellite cross-reference analytics for anomaly auditing.'
                                    ].map(text => (
                                        <li key={text} className="flex items-start gap-3 text-slate-400">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm font-medium">{text}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link to={createPageUrl('Submit')}>
                                    <Button className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-600/20">
                                        Login to Contributor Hub
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Volunteer Section */}
            <section className="py-32 px-6 bg-slate-950 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-20 items-center mb-16">
                        <div>
                            <span className="inline-block px-4 py-2 bg-indigo-500/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-8 border border-indigo-500/20 flex items-center gap-2 w-fit">
                                <Zap className="w-3 h-3 fill-indigo-400" /> Heart of the Ecosystem
                            </span>
                            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-10">
                                The Global <span className="text-indigo-400">Volunteer Collective.</span>
                            </h2>
                            <p className="text-xl text-slate-400 leading-relaxed mb-12">
                                Mechovate is more than a tool—it's a movement. Thousands of volunteers collaborate in real-time to solve environmental mysteries, peer-review data, and ensure planetary truth is accessible to all.
                            </p>

                            <div className="flex items-center gap-4 mb-12">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-900 bg-slate-800 overflow-hidden shadow-xl">
                                            <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Avatar" />
                                        </div>
                                    ))}
                                    <div className="w-12 h-12 rounded-full border-4 border-slate-900 bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white shadow-xl">
                                        +4k
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-black text-white tracking-tight">Join 4,281 Activists</p>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active in 124 countries</p>
                                </div>
                            </div>

                            <Link to={createPageUrl('CommunityHub')}>
                                <Button className="h-16 px-12 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 shadow-xl">
                                    Enter Community Hub
                                </Button>
                            </Link>
                        </div>

                        <div className="relative">
                            {/* Reddit-style Mobile App Mockup */}
                            <Link to={createPageUrl('CommunityHub')} className="block group">
                                <div className="relative mx-auto w-[280px] h-[580px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden">
                                    <div className="absolute top-0 w-full h-6 bg-slate-800 flex justify-center pt-1">
                                        <div className="w-16 h-1 bg-slate-700 rounded-full" />
                                    </div>

                                    {/* App Header */}
                                    <div className="pt-8 px-4 pb-2 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center">
                                                <Users className="w-3.5 h-3.5 text-white" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-tighter italic text-slate-900 dark:text-white">Collective</span>
                                        </div>
                                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800" />
                                    </div>

                                    {/* Feed Preview */}
                                    <div className="p-4 space-y-4 overflow-y-auto h-full scrollbar-hide bg-slate-50 dark:bg-slate-950">
                                        {[
                                            { user: 'EcoWarrior', title: 'Unexpected methane spike...', up: '245' },
                                            { user: 'Dr_Green', title: 'Review: Anomaly #4829...', up: '128' },
                                            { user: 'SkyWatcher', title: 'Cloud formation anomaly noted...', up: '89' }
                                        ].map((post, i) => (
                                            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700" />
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">u/{post.user}</span>
                                                </div>
                                                <h5 className="text-[11px] font-black leading-tight mb-3 tracking-tight text-slate-900 dark:text-white">{post.title}</h5>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1">
                                                        <ArrowBigUp className="w-3 h-3 text-indigo-500" />
                                                        <span className="text-[9px] font-black text-slate-700 dark:text-slate-300">{post.up}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-slate-400">
                                                        <MessageSquare className="w-3 h-3" />
                                                        <span className="text-[9px] font-black">42</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* App Bottom Nav */}
                                    <div className="absolute bottom-0 w-full h-16 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-around px-4">
                                        <div className="p-2 text-indigo-600"><Layers className="w-5 h-5" /></div>
                                        <div className="p-2 text-slate-400"><Database className="w-5 h-5" /></div>
                                        <div className="p-2 text-slate-400"><BarChart3 className="w-5 h-5" /></div>
                                        <div className="p-2 text-slate-400"><Users className="w-5 h-5" /></div>
                                    </div>
                                </div>
                            </Link>

                            {/* Floating Interaction Labels */}
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                className="absolute top-20 -right-4 bg-indigo-600 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl rotate-6 pointer-events-none"
                            >
                                Upvote Truth
                            </motion.div>
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                className="absolute bottom-40 -left-10 bg-slate-900 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl -rotate-12 border border-slate-800 pointer-events-none"
                            >
                                Peer Validation
                            </motion.div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                        <div className="grid md:grid-cols-2 gap-8">
                            {[
                                { icon: Globe, title: 'Regional Circles', desc: 'Local forums to discuss anomalies and coordinate hyper-local validation missions.', color: 'text-indigo-400', bg: 'bg-indigo-950/40' },
                                { icon: Users, title: 'Peer Auditing', desc: 'Crowdsourced review protocols to enhance machine learning confidence scores.', color: 'text-emerald-400', bg: 'bg-emerald-950/40' }
                            ].map((item, i) => (
                                <Link key={i} to={createPageUrl('CommunityHub')} className="block">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-md h-full"
                                    >
                                        <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-6`}>
                                            <item.icon className={`w-6 h-6 ${item.color}`} />
                                        </div>
                                        <h4 className="text-lg font-black text-white mb-3 tracking-tight">{item.title}</h4>
                                        <p className="text-sm text-slate-500 leading-relaxed italic">{item.desc}</p>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>

                        <Link to={createPageUrl('CommunityHub')} className="block">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-md relative overflow-hidden group h-full flex items-center"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform">
                                    <Zap className="w-24 h-24 text-amber-500" />
                                </div>
                                <div className="flex items-center gap-6 p-8">
                                    <div className="w-16 h-16 bg-amber-950/40 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <Zap className="w-8 h-8 text-amber-500 fill-amber-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-xl font-black text-white tracking-tight uppercase tracking-tighter">Clarity Points & Recognition</h4>
                                            <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[8px] font-black rounded-full border border-amber-500/20 uppercase tracking-widest">Global Ranking System</span>
                                        </div>
                                        <p className="text-sm text-slate-500 italic max-w-md">
                                            Earn verified credentials and visibility for discovering high-impact environmental anomalies through rigorous data submission.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 border-t border-slate-100 dark:border-slate-800">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <Database className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-black tracking-tighter uppercase italic">Mechovate</span>
                    </div>

                    <p className="text-xs font-black text-slate-400 tracking-widest uppercase">
                        © 2026 Mechovate Planetary Systems • Built for Sustainability
                    </p>

                    <div className="flex items-center gap-6">
                        {['Privacy', 'Intelligence', 'Security'].map(item => (
                            <a key={item} href="#" className="text-[10px] font-black text-slate-500 hover:text-indigo-600 uppercase tracking-[0.2em] transition-colors">{item}</a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}
