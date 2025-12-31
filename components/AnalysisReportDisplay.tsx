
import React from 'react';
import { SkinAnalysisReport, AnalysisDetail } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface Props {
  report: SkinAnalysisReport;
}

const AnalysisReportDisplay: React.FC<Props> = ({ report }) => {
  const scoreData = [
    { name: 'Score', value: report.overall_score },
    { name: 'Remaining', value: 10 - report.overall_score }
  ];

  const getStatusLabel = (score: number) => {
    if (score >= 8.5) return 'Excellent';
    if (score >= 7) return 'Good';
    if (score >= 5) return 'Average';
    return 'Poor';
  };

  const getCardIcon = (key: string) => {
    switch (key.toLowerCase()) {
      case 'acne': return 'check_circle';
      case 'dark_circles': return 'visibility';
      case 'dark_spots': return 'blur_on';
      case 'skin_tone': return 'auto_awesome';
      default: return 'texture';
    }
  };

  const getCardColors = (severity: string) => {
    const s = severity.toLowerCase();
    if (s === 'low' || s === 'clear') return { icon: 'text-emerald-500', bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700', progress: 'bg-emerald-500' };
    if (s === 'medium' || s === 'visible' || s === 'moderate') return { icon: 'text-amber-500', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700', progress: 'bg-amber-400' };
    return { icon: 'text-rose-500', bg: 'bg-rose-50', badge: 'bg-rose-100 text-rose-700', progress: 'bg-rose-500' };
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="flex flex-col px-5 pb-32 w-full max-w-md mx-auto animate-in slide-in-from-bottom duration-500">
      <div className="flex flex-col items-center justify-center py-6">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/10 dark:bg-primary/5 blur-2xl transform scale-110"></div>
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle className="text-gray-200 dark:text-gray-700 opacity-30" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="6"></circle>
            <circle 
              cx="50" cy="50" fill="none" r="45" stroke="#42c4f0" 
              strokeDasharray="283" 
              strokeDashoffset={283 - (283 * report.overall_score) / 10} 
              strokeLinecap="round" strokeWidth="6"
              className="transition-all duration-1000"
            ></circle>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold text-text-main dark:text-white tracking-tight">{report.overall_score}</span>
            <span className="text-sm font-semibold text-primary uppercase tracking-wide mt-1">{getStatusLabel(report.overall_score)}</span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 bg-white dark:bg-surface-dark px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-800">
          <span className="material-symbols-outlined text-text-secondary text-sm">calendar_today</span>
          <span className="text-sm text-text-secondary font-medium">Scan from {report.date}</span>
        </div>
        <p className="mt-6 text-center text-text-secondary dark:text-gray-400 max-w-xs leading-relaxed font-medium">
          Based on our AI analysis, your skin is <span className="text-primary font-bold">{report.skin_category.toLowerCase()}</span>. 
          Follow our recommendations below for a healthier glow.
        </p>
      </div>

      <div className="mt-8 mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-main dark:text-white">Detailed Breakdown</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {(Object.entries(report.analysis) as [string, AnalysisDetail][]).map(([key, data]) => {
          const styles = getCardColors(data.severity);
          return (
            <div key={key} className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-transparent shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-full ${styles.bg} flex items-center justify-center ${styles.icon}`}>
                  <span className="material-symbols-outlined filled">{getCardIcon(key)}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full ${styles.badge} text-[10px] font-bold uppercase tracking-tight`}>
                  {data.severity}
                </span>
              </div>
              <h3 className="font-bold text-text-main dark:text-white text-base capitalize">{key.replace('_', ' ')}</h3>
              <div className="mt-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`${styles.progress} h-full rounded-full transition-all duration-1000`} 
                  style={{ width: data.severity.toLowerCase() === 'low' ? '90%' : data.severity.toLowerCase() === 'medium' ? '50%' : '20%' }}
                ></div>
              </div>
              <p className="mt-2 text-[10px] text-text-secondary dark:text-gray-400 font-medium leading-tight">{data.details}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-text-main dark:text-white mb-4">AI Routines</h2>
        <div className="space-y-3">
          {report.recommendations.map((rec, i) => (
            <div key={i} className="flex gap-4 items-start bg-primary rounded-[1.75rem] p-5 text-white shadow-lg shadow-primary/20">
              <span className="text-[10px] font-black bg-white text-primary w-6 h-6 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                {i + 1}
              </span>
              <p className="text-sm font-bold leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main CTA: Download PDF Report */}
      <div className="no-print mt-10">
        <button 
          onClick={handleDownloadPDF}
          className="w-full relative overflow-hidden rounded-2xl h-14 bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 text-white shadow-[0_4px_14px_0_rgba(66,196,240,0.39)]"
        >
          <div className="relative z-10 flex items-center justify-center gap-2.5">
            <span className="material-symbols-outlined font-medium">download</span>
            <span className="text-[16px] font-bold tracking-wide uppercase">Download PDF Report</span>
          </div>
        </button>
      </div>

      <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-6 rounded-[2rem] flex items-start gap-4 mt-8">
        <span className="material-symbols-outlined text-slate-400">shield</span>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold italic leading-relaxed">
          {report.disclaimer} This is an AI-generated assessment for aesthetic purposes only. Not for medical treatment.
        </p>
      </div>

      <div className="flex justify-center py-10 opacity-30">
        <span className="text-[9px] font-black uppercase tracking-[0.4em]">SkinAI Lab • 2025</span>
      </div>
    </div>
  );
};

export default AnalysisReportDisplay;
