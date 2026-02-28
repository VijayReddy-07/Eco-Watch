import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/lib/utils';
import {
    MessageSquare, ArrowBigUp, ArrowBigDown, Share2,
    MoreHorizontal, Plus, Search, Filter, Hash,
    Users, Award, TrendingUp, Clock, Globe, ShieldCheck,
    Image as ImageIcon, Link as LinkIcon, MapPin, Loader2,
    ArrowLeft, Activity, Eye, Zap, CheckCircle2, X
} from 'lucide-react';
import { Button } from '@api/components/ui/button';
import { Card, CardContent } from '@api/components/ui/card';
import { Input } from '@api/components/ui/input';
import { Badge } from '@api/components/ui/badge';
import { Textarea } from '@api/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@api/components/ui/use-toast';
import confetti from 'canvas-confetti';

const categories = [
    { name: 'All', icon: Globe },
    { name: 'Regional Circles', icon: MapPin },
    { name: 'Peer Auditing', icon: ShieldCheck },
    { name: 'Clarity Points', icon: Award },
    { name: 'Announcements', icon: Hash }
];

const mockPosts = [
    {
        id: 1,
        author: 'EcoWarrior_99',
        authorAvatar: 'https://i.pravatar.cc/150?u=1',
        category: 'Regional Circles',
        title: 'Unexpected methane spike detected in Yamuna Basin',
        content: 'I noticed a significant rise in our local sensors this morning. Has anyone in the North Circle seen similar telemetry? We might need a coordinated validation mission.',
        image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=1000&auto=format&fit=crop',
        upvotes: 245,
        comments: 42,
        time: new Date(Date.now() - 1000 * 60 * 60 * 2),
        isUpvoted: true
    },
    {
        id: 2,
        author: 'Dr_Greenfield',
        authorAvatar: 'https://i.pravatar.cc/150?u=2',
        category: 'Peer Auditing',
        title: 'Review Request: Satellite cross-reference for Anomaly #4829',
        content: "The ML model flagged this as high-confidence, but I'm seeing conflicting signatures in the IR spectrum. Expert contributors, please assist with audit protocols.",
        upvotes: 128,
        comments: 15,
        time: new Date(Date.now() - 1000 * 60 * 60 * 5),
    },
    {
        id: 3,
        author: 'GlobalMod',
        authorAvatar: 'https://i.pravatar.cc/150?u=3',
        category: 'Announcements',
        title: 'New "Clarity Points" system is now live!',
        content: 'We have updated our recognition protocols. Verified contributors will now earn bonus visibility for finding high-impact anomalies.',
        upvotes: 890,
        comments: 156,
        time: new Date(Date.now() - 1000 * 60 * 60 * 24),
    }
];

const PostCard = ({ post }) => {
    const [votes, setVotes] = useState(post.upvotes);
    const [voteStatus, setVoteStatus] = useState(post.isUpvoted ? 1 : 0);

    const handleVote = (dir) => {
        if (voteStatus === dir) {
            setVoteStatus(0);
            setVotes(v => v - dir);
        } else {
            setVotes(v => v - voteStatus + dir);
            setVoteStatus(dir);
        }
    };

    return (
        <Card className="mb-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors bg-white dark:bg-slate-900 overflow-hidden group">
            <div className="flex">
                {/* Voting Sidebar */}
                <div className="w-12 bg-slate-50/50 dark:bg-slate-950/20 py-4 flex flex-col items-center gap-1 border-r border-slate-50 dark:border-slate-800">
                    <button
                        onClick={() => handleVote(1)}
                        className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${voteStatus === 1 ? 'text-indigo-600' : 'text-slate-400'}`}
                    >
                        <ArrowBigUp className={`w-6 h-6 ${voteStatus === 1 ? 'fill-current' : ''}`} />
                    </button>
                    <span className={`text-xs font-black italic tracking-tighter ${voteStatus === 1 ? 'text-indigo-600' : voteStatus === -1 ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>
                        {votes}
                    </span>
                    <button
                        onClick={() => handleVote(-1)}
                        className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${voteStatus === -1 ? 'text-rose-500' : 'text-slate-400'}`}
                    >
                        <ArrowBigDown className={`w-6 h-6 ${voteStatus === -1 ? 'fill-current' : ''}`} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-4 lg:p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <img src={post.authorAvatar} alt="" className="w-6 h-6 rounded-full" />
                        <span className="text-xs font-black text-slate-900 dark:text-white hover:underline cursor-pointer tracking-tight italic">u/{post.author}</span>
                        <div className="w-1 h-1 rounded-full bg-slate-300 mx-1" />
                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 border-none px-2">
                            {post.category}
                        </Badge>
                        <span className="text-[10px] text-slate-500 font-bold ml-auto">{formatDistanceToNow(new Date(post.time))} ago</span>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter leading-tight hover:text-indigo-600 cursor-pointer">
                        {post.title}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 italic">
                        {post.content}
                    </p>

                    {post.image && (
                        <div className="rounded-2xl overflow-hidden mb-6 border border-slate-100 dark:border-slate-800">
                            <img src={post.image} alt="Post content" className="w-full h-auto max-h-[400px] object-cover" />
                        </div>
                    )}

                    <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-lg transition-all">
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-xs font-black tracking-widest uppercase">{post.comments} Comments</span>
                        </button>
                        <button className="flex items-center gap-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-lg transition-all">
                            <Share2 className="w-4 h-4" />
                            <span className="text-xs font-black tracking-widest uppercase">Share</span>
                        </button>
                        <button className="flex items-center gap-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-lg transition-all ml-auto">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('Regional Circles');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        const newPost = {
            id: Math.random(),
            author: 'Current_User',
            authorAvatar: 'https://i.pravatar.cc/150?u=99',
            category,
            title,
            content,
            upvotes: 1,
            comments: 0,
            time: new Date(),
        };

        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        onPostCreated(newPost);

        toast({
            title: "Post Broadcasted Successfully!",
            description: "Your data has been transmitted to the collective for validation.",
            duration: 5000,
        });

        setIsSubmitting(false);
        setTitle('');
        setContent('');
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden"
            >
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Create Community Post</h2>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Contribute to the collective intelligence</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
                            <X className="w-6 h-6" />
                        </Button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Post Category</label>
                            <div className="flex flex-wrap gap-2">
                                {categories.slice(1).map(cat => (
                                    <button
                                        key={cat.name}
                                        type="button"
                                        onClick={() => setCategory(cat.name)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${category === cat.name
                                            ? 'bg-indigo-600 text-white border-indigo-600'
                                            : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-transparent hover:border-slate-200'
                                            }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Catchy Title</label>
                            <Input
                                required
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="What's happening in your region?"
                                className="h-14 rounded-2xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold px-6"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Detailed Description</label>
                            <Textarea
                                required
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                placeholder="Provide data, context, or ask for validation..."
                                className="min-h-[150px] rounded-2xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold p-6 leading-relaxed"
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-xs border-2"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-[2] h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/20"
                            >
                                {isSubmitting ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Broadcasting...</>
                                ) : (
                                    'Submit Post'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default function CommunityHub() {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [posts, setPosts] = useState(mockPosts);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleAddPost = (newPost) => {
        setPosts([newPost, ...posts]);
    };

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
            {/* Community Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 pt-8 pb-4 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-6">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate(-1)}
                                className="rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <Users className="w-6 h-6 text-indigo-600" />
                                    <h1 className="text-3xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white leading-none">Global Collective Hub</h1>
                                </div>
                                <p className="text-xs text-slate-500 font-bold tracking-tight uppercase tracking-widest truncate">Decentralized Environmental Truth Network</p>
                            </div>
                        </div>
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.2rem] h-14 px-8 font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/20 group"
                        >
                            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" /> Create New Post
                        </Button>
                    </div>

                    {/* Metrics Bar */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Active Guardians', val: '4,281', icon: Users, color: 'text-indigo-500' },
                            { label: 'Verified Anomalies', val: '1,248', icon: CheckCircle2, color: 'text-emerald-500' },
                            { label: 'Active Missions', val: '12', icon: Activity, color: 'text-amber-500' },
                            { label: 'Network Health', val: '99.8%', icon: Zap, color: 'text-indigo-400' }
                        ].map((stat, i) => (
                            <div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-lg font-black text-slate-900 dark:text-white leading-none tracking-tighter italic">{stat.val}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-4 hide-scrollbar">
                        {categories.map(cat => {
                            const Icon = cat.icon;
                            return (
                                <button
                                    key={cat.name}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all border whitespace-nowrap ${selectedCategory === cat.name
                                        ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white'
                                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{cat.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Live Anomaly Ticker */}
                <div className="bg-indigo-600/5 dark:bg-indigo-400/5 border-y border-indigo-100 dark:border-indigo-900/30 overflow-hidden whitespace-nowrap py-2 relative">
                    <motion.div
                        animate={{ x: [0, -2000] }}
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                        className="flex gap-12 items-center"
                    >
                        {[
                            'LIVE ALERT: High methane signal in South Delhi (99% confidence)',
                            'PEER AUDIT NEEDED: Sat-ref #4829 spectral signature conflict',
                            'NEW BADGE: u/GreenGuru earned "Spectral Master" status',
                            'SYSTEM STATUS: Planetary Digital Twin synchronized (42ms latency)',
                            'MISSION ALERT: Yamuna basin validation mission at 85% completion',
                        ].map((text, i) => (
                            <span key={i} className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                                <Zap className="w-3 h-3 fill-current" /> {text}
                            </span>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-12 gap-8">
                {/* Posts Feed */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center gap-6 mb-6 px-2">
                        {[
                            { name: 'Hot', icon: TrendingUp },
                            { name: 'New', icon: Clock },
                            { name: 'Top', icon: Award }
                        ].map(type => (
                            <button key={type.name} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1.5 group">
                                <type.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                {type.name}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="popLayout">
                        {posts.filter(p => selectedCategory === 'All' || p.category === selectedCategory).map(post => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <PostCard post={post} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Community About */}
                    <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-xl overflow-hidden rounded-[2rem]">
                        <div className="h-2 bg-indigo-600 w-full" />
                        <CardContent className="p-8">
                            <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6 italic">About Collective</h4>
                            <p className="text-xs text-slate-500 font-bold italic leading-relaxed mb-8">
                                The Mechovate collective is a decentralized network of environmental guardians. We use consensus-based peer auditing to ensure planetary truth.
                            </p>
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">4,281</p>
                                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none">Guardians</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-emerald-500 tracking-tighter">892</p>
                                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none">Online</p>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full rounded-[1.2rem] h-12 border-2 font-black uppercase tracking-widest text-[10px]">
                                Community Credentials
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Active Missions */}
                    <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-xl rounded-[2.2rem]">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white italic">Active Missions</h4>
                                <Badge className="bg-amber-500/10 text-amber-500 border-none text-[8px] font-black uppercase">Urgent</Badge>
                            </div>
                            <div className="space-y-6">
                                {[
                                    { mission: 'Spectral Audit #28', target: 'Methane Leak', progress: 85 },
                                    { mission: 'Visual Validation', target: 'Illegal Deforestation', progress: 42 }
                                ].map((m, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-slate-900 dark:text-white">{m.mission}</span>
                                            <span className="text-indigo-600">{m.progress}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${m.progress}%` }}
                                                className="h-full bg-indigo-600"
                                            />
                                        </div>
                                        <p className="text-[9px] text-slate-400 font-bold italic">Target: {m.target}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Contributors */}
                    <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-xl rounded-[2.2rem]">
                        <CardContent className="p-8">
                            <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-8 italic">Top Contributors</h4>
                            <div className="space-y-6">
                                {[
                                    { name: 'u/GreenGuru', points: '12,480', rank: 1, color: 'text-amber-500' },
                                    { name: 'u/EcoSentry', points: '9,842', rank: 2, color: 'text-slate-400' },
                                    { name: 'u/NatureWatch', points: '8,211', rank: 3, color: 'text-orange-400' }
                                ].map((guardian) => (
                                    <div key={guardian.name} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-xs ${guardian.color}`}>
                                                #{guardian.rank}
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-slate-900 dark:text-slate-200 uppercase italic tracking-tighter leading-none mb-1 group-hover:text-indigo-600">{guardian.name}</p>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{guardian.points} Clarity Points</p>
                                            </div>
                                        </div>
                                        <Award className={`w-4 h-4 ${guardian.color}`} />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Impact Meter */}
                    <Card className="bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 rounded-[2.2rem] overflow-hidden">
                        <CardContent className="p-8">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-6 opacity-80">Collective Impact</h4>
                            <div className="flex items-center gap-6 mb-8">
                                <div className="text-4xl font-black tracking-tighter italic">92.4%</div>
                                <div className="h-12 w-[2px] bg-white/20" />
                                <div className="text-[10px] uppercase font-black tracking-widest leading-tight">Planetary <br /> Awareness</div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest opacity-80">
                                    <span>Signal Accuracy</span>
                                    <span>+12% vs last moon</span>
                                </div>
                                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '92%' }}
                                        className="h-full bg-white"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <CreatePostModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onPostCreated={handleAddPost}
            />
        </div>
    );
}
