import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  Wind, Droplets, Leaf, Volume2, Brain, TrendingUp, TrendingDown, Minus,
  AlertTriangle, Loader2, RefreshCw, Zap, Trash2, FlaskConical, Sun, Activity, HelpCircle
} from 'lucide-react';
import { Button } from '@api/components/ui/button';
import {
  calculateScores,
  detectAnomalies,
  getRecommendations,
  generateInsights
} from '@api/utils/environmentalLogic';

const typeConfig = {
  air_quality: { icon: Wind, color: 'text-sky-600', bg: 'bg-sky-50 border-sky-200', label: 'Air Quality' },
  water_quality: { icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', label: 'Water Quality' },
  biodiversity: { icon: Leaf, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', label: 'Biodiversity' },
  noise_level: { icon: Volume2, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', label: 'Noise Level' },
  waste: { icon: Trash2, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200', label: 'Waste Management' },
  soil_quality: { icon: FlaskConical, color: 'text-stone-600', bg: 'bg-stone-50 border-stone-200', label: 'Soil Quality' },
  weather: { icon: Sun, color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200', label: 'Weather Metrics' },
  radiation: { icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200', label: 'Radiation' },
  custom: { icon: HelpCircle, color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200', label: 'Other/Custom' }
};

export default function AIAnalysisSummary({ observations }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Stats for cards
  const typeStats = React.useMemo(() => Object.keys(typeConfig).map(type => {
    const items = observations.filter(o => o.type === type);
    const critical = items.filter(o => o.severity === 'critical').length;
    const high = items.filter(o => o.severity === 'high').length;
    return { type, count: items.length, critical, high };
  }), [observations]);

  useEffect(() => {
    if (observations.length > 0 && !summary) {
      runAnalysis();
    }
  }, [observations.length]);

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);

    // 1. DETERMINISTIC ANALYSIS STEP
    const { scores, overall_score } = calculateScores(observations);
    const anomaliesList = detectAnomalies(observations);
    const recoList = getRecommendations(scores);
    const insights = generateInsights(scores, anomaliesList);

    try {
      // 2. AI NARRATION STEP (Optional Enhancer)
      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `As an Environmental Scientist, narrate these deterministic findings for EcoWatch.
        Overall Health Score: ${overall_score}/100
        Category Scores: ${JSON.stringify(scores)}
        Anomalies Found: ${anomaliesList.length}
        Key Inconsistencies: ${JSON.stringify(anomaliesList)}
        
        TASK:
        1. Refine the concerns and positive findings into professional bullet points.
        2. Format the 3 prioritized recommendations provided below into a professional environmental policy list.
        Prioritized Recommendations: ${recoList.join('; ')}`,
        response_json_schema: {
          type: 'object',
          properties: {
            concerns: { type: 'array', items: { type: 'string' } },
            positives: { type: 'array', items: { type: 'string' } },
            recommendations: { type: 'array', items: { type: 'string' } }
          }
        }
      });

      setSummary({
        overall_score,
        scores,
        anomalies: anomaliesList,
        concerns: aiResponse.concerns || insights.concerns,
        positives: aiResponse.positives || insights.positives,
        recommendations: aiResponse.recommendations || recoList
      });

    } catch (err) {
      console.error('AI Narration Error, falling back to deterministic results:', err);
      // Fallback: Purely deterministic results
      setSummary({
        overall_score,
        scores,
        anomalies: anomaliesList,
        concerns: insights.concerns,
        positives: insights.positives,
        recommendations: recoList
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 h-full overflow-hidden flex flex-col shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center shadow-sm">
            <Brain className="w-5 h-5 text-violet-600 fill-violet-600/10" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-white text-[15px]">AI Analysis Summary</h3>
        </div>
        <Button size="sm" variant="outline" onClick={runAnalysis} disabled={loading || observations.length === 0}
          className="text-xs h-8 px-3 gap-1.5 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all font-semibold shadow-sm active:scale-95">
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          Refresh
        </Button>
      </div>

      <div className="p-5 space-y-8 overflow-y-auto custom-scrollbar">
        {/* Cat Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {typeStats.map(({ type, count, critical, high }) => {
            const cfg = typeConfig[type];
            const Icon = cfg.icon;
            const score = summary?.scores?.[type] || (type === 'air_quality' ? 60 : type === 'water_quality' ? 80 : type === 'biodiversity' ? 75 : 65);
            const totalAlerts = critical + high;
            return (
              <div key={type} className={`rounded-[2rem] border border-slate-100 dark:border-slate-800 p-5 relative overflow-hidden group hover:shadow-lg transition-all duration-300 ${cfg.bg} bg-opacity-40`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-xl bg-white/50 dark:bg-slate-900/50 ${cfg.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {totalAlerts > 0 && (
                    <div className="flex items-center gap-0.5 text-[11px] font-bold text-rose-500">
                      <AlertTriangle className="w-3.5 h-3.5" /> {totalAlerts}
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <p className={`text-2xl font-black ${cfg.color} tracking-tight`}>{count}</p>
                  <p className="text-[11px] text-slate-500 font-bold tracking-tight">{cfg.label}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${cfg.color.replace('text', 'bg')} opacity-80`} style={{ width: `${score}%` }} />
                  </div>
                  <span className={`text-[11px] font-black ${cfg.color} opacity-80 min-w-[18px]`}>{score}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Overall Health Index */}
        {(summary || !loading) && (
          <div className="py-2 flex flex-col items-center">
            <p className="text-sm font-bold text-slate-400 dark:text-slate-500 mb-2">Overall Environmental Health</p>
            <div className="flex items-baseline gap-1.5 mb-5">
              <span className="text-6xl font-black text-amber-500">{summary?.overall_score || 70}</span>
              <span className="text-2xl font-bold text-slate-300">/100</span>
            </div>
            <div className="w-full flex items-center gap-4 px-2">
              <div className="flex-1 h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-1000"
                  style={{ width: `${summary?.overall_score || 70}%` }} />
              </div>
              <span className="text-sm font-black text-amber-500">{summary?.overall_score || 70}</span>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-violet-400 rounded-full animate-ping opacity-20" />
              <Loader2 className="w-10 h-10 animate-spin text-violet-600 relative z-10" />
            </div>
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">Synchronizing Analysis...</p>
          </div>
        )}

        {/* AI Analysis Result */}
        {summary && !loading && (
          <div className="space-y-8 pb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Concerns */}
            <div className="space-y-3 px-1">
              <p className="text-sm font-black text-rose-500 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Key Concerns
              </p>
              <ul className="space-y-3">
                {summary.concerns.map((c, i) => (
                  <li key={i} className="text-[13px] text-slate-600 dark:text-slate-400 flex items-start gap-4 leading-relaxed font-medium group">
                    <div className="w-1.5 h-1.5 rounded-sm bg-rose-400 mt-2 flex-shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            {/* Positives */}
            <div className="space-y-3 px-1">
              <p className="text-sm font-black text-emerald-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Positive Findings
              </p>
              <ul className="space-y-3">
                {summary.positives.map((p, i) => (
                  <li key={i} className="text-[13px] text-slate-600 dark:text-slate-400 flex items-start gap-4 leading-relaxed font-medium">
                    <div className="w-1.5 h-1.5 rounded-sm bg-emerald-500 mt-2 flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Anomalies */}
            <div className="space-y-4 px-1">
              <p className="text-sm font-black text-orange-600 flex items-center gap-2">
                <Zap className="w-4 h-4" /> Detected Anomalies ({summary.anomalies.length})
              </p>
              <div className="space-y-3">
                {summary.anomalies.map((a, i) => (
                  <div key={i} className="bg-orange-50/50 dark:bg-orange-900/5 border border-orange-100 dark:border-orange-900/20 rounded-2xl p-4 hover:shadow-md transition-all duration-300">
                    <p className="text-[13px] font-black text-orange-800 dark:text-orange-300 mb-1 leading-tight">{a.title}</p>
                    <p className="text-[11px] text-orange-600 dark:text-orange-400 font-bold leading-relaxed">{a.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-violet-50/50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-900/30 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-1.5 bg-violet-100 dark:bg-violet-800/40 rounded-lg">
                  <Zap className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 fill-violet-600 dark:fill-violet-400" />
                </div>
                <p className="text-[10px] font-black text-violet-700 dark:text-violet-300 uppercase tracking-widest">Prioritized Recommendations</p>
              </div>
              <div className="space-y-4">
                {summary.recommendations.map((rec, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-[13px] font-black text-violet-400">{i + 1}.</span>
                    <p className="text-[13px] text-violet-600 dark:text-violet-400 leading-relaxed font-bold">
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!summary && !loading && !error && (
          <div className="text-center py-20 flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner group">
              <Brain className="w-10 h-10 text-slate-200 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-black text-slate-800 dark:text-slate-200 tracking-tight">Environmental Intelligence</p>
              <p className="text-xs text-slate-400 px-10 leading-relaxed font-semibold">Click "Refresh" to generate a deep-learning assessment of the current trends.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
