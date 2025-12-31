
import React, { useState, useEffect } from 'react';
import SkinAnalysisTool from './components/SkinAnalysisTool';
import ChatBot from './components/ChatBot';
import { Tab } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<'splash' | 'welcome' | 'main'>('splash');
  const [activeTab, setActiveTab] = useState<Tab>('home');

  useEffect(() => {
    if (appState === 'splash') {
      const timer = setTimeout(() => setAppState('welcome'), 2500);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  if (appState === 'splash') {
    return (
      <div className="relative flex h-screen w-full flex-col items-center justify-between overflow-hidden bg-white dark:bg-slate-900 p-6 max-w-md mx-auto shadow-2xl">
        <div className="absolute top-[-10%] left-[-10%] h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] h-80 w-80 rounded-full bg-blue-200/20 dark:bg-primary/5 blur-3xl pointer-events-none"></div>
        <div className="flex-1"></div>
        <div className="flex flex-col items-center justify-center w-full max-w-sm z-10 animate-fade-in-up">
          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute inset-0 bg-primary/20 rounded-full scale-110 blur-sm"></div>
            <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl bg-white shadow-sm dark:bg-slate-800 border border-slate-100 dark:border-slate-700 overflow-hidden">
               <span className="material-symbols-outlined text-primary text-6xl filled">face_retouching_natural</span>
            </div>
          </div>
          <h1 className="text-slate-900 dark:text-white tracking-tight text-4xl font-extrabold leading-tight text-center mb-2">
            Skin<span className="text-primary">AI</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-normal text-center max-w-[280px]">
            Smart analysis for healthier skin.
          </p>
        </div>
        <div className="flex-1"></div>
        <div className="w-full flex flex-col items-center gap-4 z-10 pb-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-primary"></div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-slate-400 dark:text-slate-600 text-xs font-medium uppercase tracking-wider text-center">
              Powered by Intelligent Dermatology
            </p>
            <p className="text-slate-300 dark:text-slate-700 text-[10px] font-normal text-center">
              v1.0.2
            </p>
          </div>
        </div>
        <style>{`
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        `}</style>
      </div>
    );
  }

  if (appState === 'welcome') {
    return (
      <div className="relative flex min-h-screen w-full flex-col justify-between overflow-x-hidden bg-background-light dark:bg-background-dark max-w-md mx-auto shadow-2xl">
        <div className="flex items-center p-4 pt-6 justify-center w-full z-10">
          <h2 className="text-text-main dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>face_retouching_natural</span>
            SkinAI
          </h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center w-full px-6 gap-6 my-4">
          <div className="relative w-full max-w-[320px] aspect-[4/5] flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/10 dark:bg-primary/5 rounded-[3rem] transform rotate-3 scale-95 blur-xl"></div>
            <div className="relative w-full h-full overflow-hidden rounded-[2.5rem] shadow-soft border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-800 z-10">
              <div 
                className="absolute inset-0 bg-center bg-cover" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBP0ktj6vhRy4aznsxSSvruVt-HwQhmTFkgEVwOQC_YJu3LQr7SIMEr3bmhYlKdYx0IdjVBW6IFAYNvIBixLGNHrsOu2RqGdBpg6AgBgJfp74sDzvpq_rBcx5lKQ13VG1ijSPo_oJhXUAs2aNV7oi-BmftYgGr0EaH0YmSwk1eWtzok88vr17Y9w7ZOBlJBMPYlJJPrPFwsYZEQHEErA7Wb3vG2VTeuVSQdPhAIloIzxJscUePyF0j6ng1t_HWhNnFHf86_dObqMDE")' }}
              />
              <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="w-full h-full border-[1px] border-primary/20 rounded-[2.5rem] m-4" style={{ width: 'calc(100% - 2rem)', height: 'calc(100% - 2rem)' }}></div>
                <div className="absolute top-1/2 left-0 right-0 h-px bg-primary/50 shadow-[0_0_15px_rgba(66,196,240,0.8)]"></div>
              </div>
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm flex items-center gap-2 border border-primary/20">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                  <span className="text-xs font-bold text-text-main dark:text-white uppercase tracking-wider">AI Ready</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 max-w-sm mt-4">
            <h1 className="text-text-main dark:text-white tracking-tight text-[32px] font-extrabold leading-tight text-center">
              Hello, Beautiful.
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-medium leading-relaxed text-center px-4">
              Let our AI analyze your skin health and build your perfect routine in seconds.
            </p>
          </div>
        </div>
        <div className="flex flex-col w-full px-6 pb-8 pt-2 gap-4">
          <div className="flex items-center justify-center gap-1.5 opacity-60">
            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400" style={{ fontSize: '14px' }}>lock</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Your photo is processed privately</p>
          </div>
          <button 
            onClick={() => setAppState('main')}
            className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-5 bg-primary hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/25 group"
          >
            <div className="text-text-main mr-3 flex items-center group-hover:rotate-12 transition-transform duration-300">
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>photo_camera</span>
            </div>
            <span className="text-text-main text-lg font-bold leading-normal tracking-wide">Scan Face</span>
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'analyze':
        return <SkinAnalysisTool />;
      case 'chat':
        return <ChatBot />;
      case 'home':
      default:
        return (
          <div className="flex flex-col space-y-6 pb-32 px-5 pt-6 animate-in fade-in duration-500">
            <header className="flex justify-between items-center">
              <div className="flex flex-col">
                <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Welcome back</p>
                <h1 className="text-2xl font-black text-text-main dark:text-white tracking-tight">Beautiful Skin</h1>
              </div>
              <div className="w-12 h-12 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl filled">face_retouching_natural</span>
              </div>
            </header>

            <div className="bg-gradient-to-br from-primary to-blue-500 rounded-[2.5rem] p-7 text-white shadow-soft relative overflow-hidden group">
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">Daily Analysis</span>
                <h2 className="text-3xl font-black mb-2 leading-tight">Ready for your<br/>daily scan?</h2>
                <p className="text-white/80 text-sm mb-8 max-w-[80%] leading-relaxed font-medium">
                  Track your progress and get updated product recommendations.
                </p>
                <button 
                  onClick={() => setActiveTab('analyze')}
                  className="bg-white text-primary px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all"
                >
                  Start Scanning
                </button>
              </div>
              <span className="material-symbols-outlined absolute -bottom-8 -right-8 text-9xl text-white/10 rotate-12 group-hover:scale-110 transition-transform duration-700">face_retouching_natural</span>
            </div>

            <section>
              <h3 className="font-black text-text-main dark:text-white text-lg mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setActiveTab('analyze')}
                  className="bg-white dark:bg-surface-dark p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-start gap-4 active:scale-[0.98] transition-all text-left"
                >
                  <div className="w-12 h-12 bg-primary-soft dark:bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined">center_focus_strong</span>
                  </div>
                  <div>
                    <span className="block font-black text-text-main dark:text-white text-sm">Scan Face</span>
                    <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">AI Vision</span>
                  </div>
                </button>
                <button 
                  onClick={() => setActiveTab('chat')}
                  className="bg-white dark:bg-surface-dark p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-start gap-4 active:scale-[0.98] transition-all text-left"
                >
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined">chat_bubble</span>
                  </div>
                  <div>
                    <span className="block font-black text-text-main dark:text-white text-sm">Ask Expert</span>
                    <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">Chat AI</span>
                  </div>
                </button>
              </div>
            </section>

            <section className="bg-white dark:bg-surface-dark rounded-[2.5rem] p-7 border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-xs uppercase tracking-widest text-text-secondary">
                  Dermatology Tips
                </h3>
                <span className="material-symbols-outlined text-primary text-sm">tips_and_updates</span>
              </div>
              <div className="space-y-4">
                {[
                  { icon: "water_drop", text: "Hydration is the key to barrier health." },
                  { icon: "wb_sunny", text: "Daily SPF prevents 80% of aging signs." },
                  { icon: "cleaning_services", text: "Cleanse for at least 60 seconds." }
                ].map((tip, i) => (
                  <div key={i} className="flex items-center gap-4 bg-background-light dark:bg-background-dark/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 group active:bg-gray-100 transition-colors">
                    <span className="material-symbols-outlined text-primary">{tip.icon}</span>
                    <p className="text-sm font-bold text-text-secondary leading-snug">{tip.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center overflow-x-hidden">
      <div className="w-full max-w-md bg-background-light dark:bg-background-dark min-h-screen relative shadow-2xl overflow-hidden flex flex-col">
        <main className="flex-1 overflow-y-auto scroll-smooth no-scrollbar">
          {renderContent()}
        </main>
        <nav className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl border-t border-gray-100 dark:border-gray-800 px-10 py-4 pb-8 flex justify-between items-center z-50 no-print shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <NavButton 
            active={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
            icon="dashboard" 
            label="Home" 
          />
          <div className="relative -top-7">
             <button 
              onClick={() => setActiveTab('analyze')}
              className={`w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-90 ${
                activeTab === 'analyze' 
                ? 'bg-primary text-white scale-110 shadow-primary/30' 
                : 'bg-text-main text-white shadow-slate-300'
              }`}
            >
              <span className="material-symbols-outlined text-3xl">center_focus_strong</span>
            </button>
          </div>
          <NavButton 
            active={activeTab === 'chat'} 
            onClick={() => setActiveTab('chat')} 
            icon="chat" 
            label="Advice" 
          />
        </nav>
      </div>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: string; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1.5 transition-all active:scale-95 ${active ? 'text-primary' : 'text-slate-400'}`}
  >
    <span className={`material-symbols-outlined text-2xl ${active ? 'filled' : ''}`}>{icon}</span>
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default App;
