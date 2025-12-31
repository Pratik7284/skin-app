
import React, { useState, useRef, useEffect } from 'react';
import { chatWithThinking, chatFast } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "Hi! I'm your skin care concierge. Ask me anything about routines, ingredients, or healthy skin habits." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'thinking' | 'fast'>('thinking');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = mode === 'thinking' ? await chatWithThinking(userMessage) : await chatFast(userMessage);
      setMessages(prev => [...prev, { role: 'model', content: response || "I'm sorry, I couldn't process that." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', content: "Connection error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto animate-in slide-in-from-right duration-300">
      <div className="bg-white dark:bg-surface-dark px-6 py-4 border-b border-slate-100 dark:border-gray-800 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-inner">
            <span className="material-symbols-outlined text-2xl filled">auto_awesome</span>
          </div>
          <div>
            <h2 className="text-lg font-black text-text-main dark:text-white leading-none">Concierge</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Expert</span>
            </div>
          </div>
        </div>
        
        <div className="flex p-1 bg-slate-100 dark:bg-gray-800 rounded-xl scale-90">
          <button 
            onClick={() => setMode('thinking')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${mode === 'thinking' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-slate-500'}`}
          >
            <span className="material-symbols-outlined text-xs">psychology</span> Think
          </button>
          <button 
            onClick={() => setMode('fast')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${mode === 'fast' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-slate-500'}`}
          >
            <span className="material-symbols-outlined text-xs">bolt</span> Fast
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 pb-32 scroll-smooth no-scrollbar"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in slide-in-from-bottom duration-300`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
              msg.role === 'user' ? 'bg-text-main text-white' : 'bg-white dark:bg-surface-dark border border-slate-100 dark:border-gray-800 text-primary'
            }`}>
               <span className="material-symbols-outlined text-sm">{msg.role === 'user' ? 'person' : 'auto_awesome'}</span>
            </div>
            <div className={`max-w-[85%] px-4 py-3 rounded-[1.25rem] text-sm font-medium leading-relaxed shadow-sm ${
              msg.role === 'user' 
              ? 'bg-text-main text-white rounded-tr-none' 
              : 'bg-white dark:bg-surface-dark text-text-main dark:text-white rounded-tl-none border border-slate-100 dark:border-gray-800'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-white dark:bg-surface-dark border border-slate-100 dark:border-gray-800 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-sm animate-spin">sync</span>
            </div>
            <div className="bg-slate-50 dark:bg-gray-800 px-4 py-3 rounded-[1.25rem] rounded-tl-none text-slate-400 text-xs font-bold animate-pulse">
              {mode === 'thinking' ? "Synthesizing expert advice..." : "Processing..."}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-[84px] left-0 right-0 w-full max-w-md mx-auto px-4 pb-2 z-40">
        <div className="bg-white dark:bg-surface-dark rounded-[2rem] border border-slate-200 dark:border-gray-800 p-2 shadow-xl shadow-slate-200/50 dark:shadow-black/50 flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
            placeholder="Ask about skin routines..."
            className="flex-1 bg-transparent border-none rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-0 text-text-main dark:text-white"
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-[#3bb0d9] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all active:scale-90 shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
