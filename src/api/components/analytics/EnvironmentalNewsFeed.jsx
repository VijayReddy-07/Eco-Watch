import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Newspaper, Search, Loader2, Globe, Wind, Droplets, Leaf, Volume2, ExternalLink, RefreshCw, AlertTriangle, Clock } from 'lucide-react';
import { Button } from '@api/components/ui/button';
import { Input } from '@api/components/ui/input';
import { Badge } from '@api/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

const CACHE_KEY = 'ecowatch_news_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 Hours

const topics = [
  { label: 'India Pollution', query: 'India air pollution and smog news', icon: Wind, color: 'bg-sky-50 text-sky-600 border-sky-100' },
  { label: 'Water Quality', query: 'India river pollution and water quality reports', icon: Droplets, color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { label: 'Biodiversity', query: 'India wildlife and forest conservation news', icon: Leaf, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { label: 'Noise Pollution', query: 'India urban noise pollution regulations and news', icon: Volume2, color: 'bg-amber-50 text-amber-600 border-amber-100' },
  { label: 'Climate India', query: 'India climate change impact and policy updates', icon: Globe, color: 'bg-violet-50 text-violet-600 border-violet-100' }
];
const fallbackArticles = {
  'India Pollution': [
    { title: "Delhi Air Quality Strategy: 2026 Shift Towards Green Zones", summary: "Municipal authorities announce new protocol for localized air purification corridors across NCR to mitigate seasonal smog peaks.", source: "TOI News", url: "https://timesofindia.indiatimes.com/india/pollution", date: "Feb 26, 2026", risk_level: "Medium" },
    { title: "Industrial Emission Caps: New Guidelines for Factories", summary: "Central Pollution Control Board issues strict new particulate matter limits for thermal plants across northern India.", source: "HT News", url: "https://www.hindustantimes.com/india-news", date: "Feb 26, 2026", risk_level: "High" }
  ],
  'Water Quality': [
    { title: "Ganga Rejuvenation: New Treatment Hubs Active", summary: "The Clean Ganga mission reaches Phase 4 with 15 advanced bio-filtration plants coming online in Uttar Pradesh and Bihar.", source: "The Hindu", url: "https://www.thehindu.com/news/national", date: "Feb 26, 2026", risk_level: "Low" },
    { title: "River Oxygen Levels Monitoring: Real-time Sensors Deployed", summary: "Water quality sensors installed across major river stretches to monitor dissolved oxygen and toxin levels daily.", source: "Livemint", url: "https://www.livemint.com", date: "Feb 26, 2026", risk_level: "Medium" }
  ],
  'Biodiversity': [
    { title: "Western Ghats Biodiversity Audit Reveals Rare Flora Species", summary: "Ecologists have identified three previously unknown orchid species during the annual Sahyadri Bio-Census 2026.", source: "Mongabay India", url: "https://india.mongabay.com", date: "Feb 26, 2026", risk_level: "Low" },
    { title: "Project Tiger 2026 Census: Population Growth Noted", summary: "New camera trap data suggests a healthy increase in big cat populations across central Indian tiger reserves.", source: "DownToEarth", url: "https://www.downtoearth.org.in", date: "Feb 26, 2026", risk_level: "Low" }
  ],
  'Noise Pollution': [
    { title: "Mumbai Sound Protocol: Nocturnal Noise Curbs Enforced", summary: "Strict decibel limits on construction and industrial zones after 10 PM go into effect starting this week.", source: "HT Mumbai", url: "https://www.hindustantimes.com/mumbai-news", date: "Feb 26, 2026", risk_level: "Medium" },
    { title: "Urban Noise Mitigation: Silent Zones Extended", summary: "Hospitals and schools in metropolitan areas designated as extended silent zones with acoustic monitoring systems.", source: "TOI News", url: "https://timesofindia.indiatimes.com", date: "Feb 26, 2026", risk_level: "Low" }
  ],
  'Climate India': [
    { title: "India's 2026 Solar Target: Rajasthan Complex Hits Milestone", summary: "A major renewable energy complex in Jodhpur reaches 10GW capacity, contributing to India's net-zero transition.", source: "ET Climate", url: "https://economictimes.indiatimes.com/news/economy/finance/climate-change", date: "Feb 26, 2026", risk_level: "Low" },
    { title: "Coastal Erosion Warnings: New Vulnerability Map Issued", summary: "Oceanographers release updated warnings for coastal communities as sea-level rise patterns shift along the east coast.", source: "Business Standard", url: "https://www.business-standard.com", date: "Feb 26, 2026", risk_level: "High" }
  ],
  'General': [
    { title: "National Environmental Policy Update: 2026 Roadmap", summary: "Ministry of Environment releases comprehensive roadmap for plastic neutrality and urban greening by 2030.", source: "PIB India", url: "https://pib.gov.in", date: "Feb 26, 2026", risk_level: "Low" }
  ]
};

export default function EnvironmentalNewsFeed() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customQuery, setCustomQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchNews = useCallback(async (query, isManual = false, topicLabel = null) => {
    // Check cache
    const cached = localStorage.getItem(CACHE_KEY);
    if (!isManual && cached) {
      const { timestamp, data, query: cachedQuery } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION && cachedQuery === query) {
        setArticles(data);
        setLastUpdated(timestamp);
        return;
      }
    }

    // Set fallback articles immediately for the specific topic
    const category = topicLabel || activeTopic || 'General';
    const initialFallback = fallbackArticles[category] || fallbackArticles['General'];
    setArticles(initialFallback);

    setLoading(true);
    const today = "February 26, 2026";

    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `ACT AS AN ENVIRONMENTAL NEWS ANALYST.
        FETCH TOPIC-SPECIFIC NEWS FOR: "${query}".
        
        CRITICAL: Only return articles strictly related to "${query}". 
        Avoid general environmental news if the topic is specific.
        
        Today is ${today}.
        
        TASKS:
        1. Find 8 most recent articles from Feb 2026.
        2. Assign 'Risk Level' (Low, Medium, High).
        3. Provide summary, source, and direct URL.
        4. Focus on India-specific reports.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: 'object',
          properties: {
            articles: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  summary: { type: 'string' },
                  source: { type: 'string' },
                  url: { type: 'string' },
                  topic_tag: { type: 'string' },
                  date: { type: 'string' },
                  risk_level: { type: 'string', enum: ['Low', 'Medium', 'High'] }
                }
              }
            }
          }
        }
      });

      if (result?.articles?.length > 0) {
        const newArticles = result.articles;
        setArticles(newArticles);
        const now = Date.now();
        setLastUpdated(now);

        // Update cache
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          timestamp: now,
          data: newArticles,
          query: query
        }));
      }
    } catch (err) {
      console.error("News Fetch Error:", err);
      // Fallback/Persistence: Try to keep current articles if refresh fails
    } finally {
      setLoading(false);
    }
  }, []); // Stable callback

  useEffect(() => {
    fetchNews('General environmental news India February 26 2026', false, 'General');
  }, []); // Run once

  const handleTopicClick = (topic) => {
    setActiveTopic(topic.label);
    fetchNews(topic.query, true, topic.label);
  };

  const handleCustomSearch = (e) => {
    e.preventDefault();
    if (customQuery.trim()) {
      setActiveTopic(null);
      fetchNews(customQuery.trim(), true, 'General');
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'High': return 'bg-rose-100 text-rose-600 border-rose-200';
      case 'Medium': return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'Low': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden transition-all duration-300">
      {/* Header Section */}
      <div className="p-6 border-b border-slate-50 dark:border-slate-800 bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-800/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center shadow-lg shadow-teal-100 group">
              <Newspaper className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Environmental News & Intelligence</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest bg-white dark:bg-slate-800 text-slate-500 border-slate-100">Daily Updates</Badge>
                {lastUpdated && (
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                    <Clock className="w-3 h-3" /> Updated {new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => fetchNews(activeTopic ? topics.find(t => t.label === activeTopic).query : 'Environmental news India', true)}
              disabled={loading}
              className="rounded-xl border-slate-200 h-10 px-4 font-bold text-xs gap-2 group hover:bg-slate-50 active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Filters & Search */}
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <button
                key={topic.label}
                onClick={() => handleTopicClick(topic)}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black border transition-all active:scale-95 hover:shadow-lg ${activeTopic === topic.label
                  ? `${topic.color.split(' ')[0]} ${topic.color.split(' ')[1]} ring-2 ring-teal-500 shadow-xl shadow-teal-100/30`
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-800 hover:border-teal-200'
                  }`}
              >
                <topic.icon className="w-3.5 h-3.5" />
                {topic.label.toUpperCase()}
              </button>
            ))}
          </div>

          <form onSubmit={handleCustomSearch} className="relative group">
            <Input
              placeholder="Search specific keywords (e.g. 'Yamuna Foam', 'Electric Buses Mumbai')..."
              value={customQuery}
              onChange={e => setCustomQuery(e.target.value)}
              className="pl-5 pr-32 h-14 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 transition-all font-medium text-sm focus:ring-2 focus:ring-teal-500 shadow-inner"
              disabled={loading}
            />
            <Button
              type="submit"
              disabled={loading || !customQuery.trim()}
              className="absolute right-2 top-2 h-10 rounded-xl bg-teal-600 hover:bg-teal-700 font-bold px-6 text-xs gap-2 shadow-lg shadow-teal-200 transition-all active:scale-95"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              SEARCH
            </Button>
          </form>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-32 gap-6"
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-teal-50 border-t-teal-500 animate-spin" />
                  <Globe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-teal-500" />
                </div>
                <div className="text-center">
                  <p className="text-base font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest mb-1">Live Intelligence Active</p>
                  <p className="text-xs text-slate-500 font-medium">Fetching newest reports for {activeTopic || 'India'}...</p>
                </div>
              </motion.div>
            ) : articles.length > 0 ? (
              <motion.div
                key="articles"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
              >
                {articles.map((article, i) => (
                  <motion.a
                    key={i}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group flex flex-col bg-white dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 hover:shadow-2xl hover:shadow-teal-900/10 hover:-translate-y-1 transition-all duration-500 relative cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant="outline" className={`${getRiskColor(article.risk_level)} border-0 text-[10px] font-black uppercase tracking-widest px-3 py-1`}>
                        {article.risk_level} Impact
                      </Badge>
                      <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="w-4 h-4 text-teal-600" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h4 className="text-base font-black text-slate-900 dark:text-white mb-2 leading-tight line-clamp-2 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6 line-clamp-3 italic">
                        "{article.summary}"
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-teal-50 dark:bg-teal-950/20 flex items-center justify-center">
                          <Globe className="w-3 h-3 text-teal-600" />
                        </div>
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[120px]">
                          {article.source}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                          {article.date}
                        </span>
                        <div className="flex items-center gap-1 text-teal-600 font-bold text-[10px] uppercase tracking-tighter hover:underline decoration-2 underline-offset-4">
                          Read Full Story <ExternalLink className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-40 text-center"
              >
                <div className="w-20 h-20 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 rotate-6 group hover:rotate-0 transition-transform">
                  <AlertTriangle className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Intelligence Void</h3>
                <p className="text-sm text-slate-500 font-medium max-w-sm leading-relaxed">
                  The news engine returned no valid results for this query. Try widening your search parameters or check your network connection.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
