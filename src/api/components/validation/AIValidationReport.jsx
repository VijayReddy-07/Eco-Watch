import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Brain, TrendingUp, Shield, Lightbulb } from 'lucide-react';
import { Badge } from '../ui/badge';

const scoreColor = (score) => {
  if (score >= 85) return { text: 'text-emerald-600', bg: 'bg-emerald-500', label: 'High Confidence', ring: 'ring-emerald-200' };
  if (score >= 60) return { text: 'text-amber-600', bg: 'bg-amber-500', label: 'Moderate Confidence', ring: 'ring-amber-200' };
  return { text: 'text-rose-600', bg: 'bg-rose-500', label: 'Low Confidence', ring: 'ring-rose-200' };
};

const statusConfig = {
  validated: { icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-200 dark:border-emerald-800', label: 'Validated' },
  pending: { icon: AlertTriangle, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-200 dark:border-amber-800', label: 'Pending Review' },
  flagged: { icon: XCircle, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40', border: 'border-rose-200 dark:border-rose-800', label: 'Flagged' }
};

export default function AIValidationReport({ validation }) {
  if (!validation) return null;

  const score = validation.confidence_score || 0;
  const colors = scoreColor(score);
  const statusCfg = statusConfig[validation.status] || statusConfig.pending;
  const StatusIcon = statusCfg.icon;
  const circumference = 2 * Math.PI * 28;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border-2 ${statusCfg.border} ${statusCfg.bg} p-5 space-y-4`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <div className="p-1.5 bg-violet-100 dark:bg-violet-900/40 rounded-lg">
          <Brain className="w-4 h-4 text-violet-600 dark:text-violet-400" />
        </div>
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">AI Validation Report</h4>
        <Badge className={`ml-auto ${statusCfg.color} ${statusCfg.bg} border ${statusCfg.border} text-xs`}>
          <StatusIcon className="w-3 h-3 mr-1" />
          {statusCfg.label}
        </Badge>
      </div>

      <div className="flex items-center gap-5">
        {/* Circular Score */}
        <div className={`relative flex-shrink-0 p-1 rounded-full ring-4 ${colors.ring}`}>
          <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="28" fill="none" stroke="#E2E8F0" strokeWidth="6" />
            <circle
              cx="36" cy="36" r="28"
              fill="none"
              stroke={score >= 85 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 36 36)"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-lg font-bold ${colors.text}`}>{score}</span>
            <span className="text-[9px] text-slate-500 dark:text-slate-400">/ 100</span>
          </div>
        </div>

        <div className="flex-1 space-y-1">
          <p className={`font-semibold ${colors.text}`}>{colors.label}</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">AI analysis complete</p>
          {validation.suggested_severity && (
            <div className="flex items-center gap-1.5 mt-2">
              <Shield className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs text-slate-600 dark:text-slate-400">Suggested severity:</span>
              <Badge className={`text-[10px] capitalize ${
                validation.suggested_severity === 'critical' ? 'bg-rose-100 text-rose-700' :
                validation.suggested_severity === 'high' ? 'bg-orange-100 text-orange-700' :
                validation.suggested_severity === 'moderate' ? 'bg-amber-100 text-amber-700' :
                'bg-emerald-100 text-emerald-700'
              }`}>
                {validation.suggested_severity}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Feedback */}
      {validation.feedback && (
        <div className="bg-white/70 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
          <div className="flex gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{validation.feedback}</p>
          </div>
        </div>
      )}

      {/* Checks */}
      {validation.checks && (
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(validation.checks).map(([key, passed]) => (
            <div key={key} className={`flex items-center gap-1.5 p-2 rounded-lg ${passed ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'bg-rose-50 dark:bg-rose-950/30'}`}>
              {passed
                ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                : <XCircle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
              }
              <span className="text-[10px] capitalize text-slate-600 dark:text-slate-400">{key.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}