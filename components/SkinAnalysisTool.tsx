
import React, { useState } from 'react';
import { analyzeSkinImage } from '../services/geminiService';
import { SkinAnalysisReport } from '../types';
import AnalysisReportDisplay from './AnalysisReportDisplay';

const SkinAnalysisTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<SkinAnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
      setReport(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!preview) return;
    setLoading(true);
    setError(null);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(p => (p < 90 ? p + Math.random() * 15 : p));
    }, 400);

    try {
      const base64 = preview.split(',')[1];
      const mimeType = file?.type || 'image/jpeg';
      const result = await analyzeSkinImage(base64, mimeType);
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => setReport(result), 500);
    } catch (err) {
      clearInterval(interval);
      console.error(err);
      setError("Analysis failed. Try a brighter photo.");
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setReport(null);
    setError(null);
    setLoading(false);
    setProgress(0);
  };

  if (report) {
    return (
      <div className="flex flex-col min-h-screen animate-in slide-in-from-bottom duration-300 pb-24 px-4 pt-4">
        <div className="flex items-center p-4 pt-6 pb-2 justify-between z-20 no-print">
          <button onClick={reset} className="text-text-main dark:text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
          </button>
          <h2 className="text-text-main dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
            Analysis Results
          </h2>
        </div>
        <AnalysisReportDisplay report={report} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="relative flex h-screen w-full flex-col overflow-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark animate-in fade-in duration-300">
        <header className="absolute top-0 left-0 w-full z-20 flex items-center justify-between p-6">
          <div className="px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 backdrop-blur-sm">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">AI Scan Active</span>
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center w-full px-6 relative z-10">
          <div className="relative mb-10">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl scale-110"></div>
            <div className="relative size-72 md:size-80">
              <svg className="size-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle className="stroke-gray-200 dark:stroke-gray-700" cx="50" cy="50" fill="none" r="46" strokeWidth="4"></circle>
                <circle 
                  className="stroke-primary drop-shadow-[0_0_4px_rgba(66,196,240,0.5)] transition-all duration-300" 
                  cx="50" cy="50" fill="none" r="46" 
                  strokeDasharray="289" 
                  strokeDashoffset={289 - (289 * progress) / 100} 
                  strokeLinecap="round" 
                  strokeWidth="4"
                ></circle>
              </svg>
              <div className="absolute inset-4 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-inner bg-gray-100 dark:bg-gray-800 relative group">
                {preview && <img src={preview} className="w-full h-full object-cover opacity-90" alt="Preview" />}
                <div className="absolute top-[40%] left-0 w-full h-12 scan-line z-10 opacity-80 mix-blend-screen"></div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 text-center z-10">
            <h1 className="text-[56px] font-extrabold text-primary leading-none tracking-tight">{Math.round(progress)}%</h1>
            <h2 className="text-xl font-bold text-text-main dark:text-white mt-2">Analyzing your skin...</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[260px] leading-relaxed">
              Mapping facial contours and detecting skin health parameters.
            </p>
          </div>
        </main>
        <footer className="p-6 relative z-10">
          <div className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
            <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary shrink-0">
              <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-text-main dark:text-white">Processing data</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Please hold still</p>
            </div>
            <button onClick={reset} className="text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors">Cancel</button>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#152329] animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center p-4 pt-6 pb-2 justify-between z-20">
        <h2 className="text-text-main dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          Scan Your Face
        </h2>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 pb-6 overflow-y-auto">
        <div className="flex flex-col items-center justify-center pt-2 pb-6">
          <h2 className="text-text-main dark:text-white tracking-tight text-[26px] font-extrabold leading-tight text-center">
            Let's analyze your skin
          </h2>
          <p className="text-text-secondary dark:text-gray-400 text-base font-medium leading-normal pt-2 text-center max-w-[280px]">
            Center your face in the frame for the best results.
          </p>
        </div>

        <div className="relative w-full aspect-[3/4] max-h-[420px] rounded-3xl overflow-hidden bg-gray-900 shadow-xl group">
          {preview ? (
             <img src={preview} className="absolute inset-0 w-full h-full object-cover opacity-80" alt="Camera preview" />
          ) : (
            <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-white/20 text-8xl">face</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="w-full h-full max-w-[260px] max-h-[340px] relative border-2 border-dashed border-white/60 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]">
              {preview && <div className="scan-line"></div>}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl -mt-1 -ml-1"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl -mt-1 -mr-1"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl -mb-1 -ml-1"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl -mb-1 -mr-1"></div>
            </div>
          </div>
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-xs font-semibold text-white uppercase tracking-wider">Live</span>
          </div>
        </div>

        <div className="w-full mt-6 grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-primary-soft dark:bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">wb_sunny</span>
            </div>
            <span className="text-xs font-semibold text-text-secondary text-center">Good Light</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-primary-soft dark:bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">face</span>
            </div>
            <span className="text-xs font-semibold text-text-secondary text-center">No Makeup</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-primary-soft dark:bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">visibility_off</span>
            </div>
            <span className="text-xs font-semibold text-text-secondary text-center">No Glasses</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#152329] p-6 pt-2 pb-8 flex flex-col gap-3 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-30">
        {!preview ? (
          <label className="w-full bg-primary hover:bg-[#3bb0d9] text-white h-14 rounded-full font-bold text-lg shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer">
            <span className="material-symbols-outlined">photo_camera</span>
            <span>Capture Photo</span>
            <input type="file" accept="image/*" capture="user" onChange={handleFileChange} className="hidden" />
          </label>
        ) : (
          <button 
            onClick={handleAnalyze}
            className="w-full bg-primary text-white h-14 rounded-full font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined">auto_awesome</span>
            <span>Analyze Now</span>
          </button>
        )}
        <label className="w-full bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 text-text-secondary dark:text-gray-300 h-12 rounded-full font-semibold text-base flex items-center justify-center gap-2 transition-colors border border-transparent cursor-pointer">
          <span className="material-symbols-outlined">image</span>
          <span>Upload from Gallery</span>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
        {preview && (
          <button onClick={reset} className="text-xs text-text-secondary font-bold uppercase tracking-widest hover:text-primary transition-colors">
            Retake Photo
          </button>
        )}
        <div className="flex items-center justify-center gap-1.5 mt-1 opacity-60">
          <span className="material-symbols-outlined text-[14px] text-text-secondary">lock</span>
          <p className="text-[11px] text-text-secondary font-medium">Your photos are private and encrypted.</p>
        </div>
      </div>

      {error && (
        <div className="absolute top-20 left-4 right-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 animate-in slide-in-from-top z-50">
          <span className="material-symbols-outlined">error</span>
          <p className="text-xs font-bold leading-tight">{error}</p>
        </div>
      )}
    </div>
  );
};

export default SkinAnalysisTool;
