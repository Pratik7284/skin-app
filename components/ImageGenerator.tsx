
import React, { useState, useEffect } from 'react';
import { ImageIcon, Wand2, Loader2, Download, AlertCircle, Key } from 'lucide-react';
import { generateSkinVisual } from '../services/geminiService';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('An artistic macro photography style representation of healthy glowing skin texture with water droplets, minimalist, soft lighting');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [loading, setLoading] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  // Supported aspect ratios for gemini-3-pro-image-preview are "1:1", "3:4", "4:3", "9:16", and "16:9".
  const ratios = ['1:1', '3:4', '4:3', '9:16', '16:9'];

  // Check if an API key has already been selected on mount.
  useEffect(() => {
    const checkApiKey = async () => {
      const aistudio = (window as any).aistudio;
      if (aistudio && typeof aistudio.hasSelectedApiKey === 'function') {
        const hasKey = await aistudio.hasSelectedApiKey();
        setHasApiKey(hasKey);
      } else {
        // Fallback for environments where the check is not applicable.
        setHasApiKey(true);
      }
    };
    checkApiKey();
  }, []);

  const handleSelectKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio && typeof aistudio.openSelectKey === 'function') {
      await aistudio.openSelectKey();
      // Assume the key selection was successful to avoid race conditions.
      setHasApiKey(true);
    }
  };

  const handleGenerate = async () => {
    // Mandatory key check before using Pro series models.
    if (!hasApiKey) {
      await handleSelectKey();
    }
    
    setLoading(true);
    setError(null);
    try {
      const url = await generateSkinVisual(prompt, aspectRatio);
      if (url) {
        setGeneratedUrl(url);
      } else {
        throw new Error("No image generated.");
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setError("API Key Error: Please ensure you have selected a valid paid project API key.");
        setHasApiKey(false); // Reset to prompt re-selection.
      } else {
        setError("Generation failed. Please try a different prompt or check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Skin Visualizer</h2>
        <p className="text-slate-500">Generate high-quality visuals for skincare research or aesthetic inspiration.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {!hasApiKey && (
            <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-3xl flex flex-col items-center text-center space-y-4">
              <Key className="w-10 h-10 text-indigo-600" />
              <div>
                <h4 className="font-bold text-indigo-900 text-lg">API Key Required</h4>
                <p className="text-sm text-indigo-700 leading-relaxed">
                  Gemini 3 Pro Image requires a paid project key. Click below to select one or set up billing.
                </p>
              </div>
              <button 
                onClick={handleSelectKey}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
              >
                Select API Key
              </button>
              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-indigo-500 underline"
              >
                Learn about billing
              </a>
            </div>
          )}

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Visual Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 h-32 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
                placeholder="Describe the skin texture or illustration you want..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-4">Aspect Ratio</label>
              <div className="grid grid-cols-5 gap-2">
                {ratios.map((r) => (
                  <button
                    key={r}
                    onClick={() => setAspectRatio(r)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      aspectRatio === r 
                        ? 'bg-orange-50 border-orange-400 text-orange-700 shadow-sm' 
                        : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt}
              className="w-full py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-200 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-orange-100 transition-all active:scale-95"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
              {loading ? 'Synthesizing Visual...' : 'Generate High-Quality Visual'}
            </button>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
          </div>

          <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
            <div className="flex items-center gap-3 mb-2 text-amber-800 font-bold">
              <Key className="w-5 h-5" /> Professional Requirements
            </div>
            <p className="text-sm text-amber-700 leading-relaxed">
              Using <strong>gemini-3-pro-image-preview</strong> requires a paid GCP project. High-quality 1K visuals generated here are suitable for professional presentations and research papers.
            </p>
          </div>
        </div>

        <div className="bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden flex flex-col min-h-[400px]">
          {generatedUrl ? (
            <div className="relative group flex-1 flex items-center justify-center bg-white">
              <img src={generatedUrl} alt="Generated" className="max-w-full max-h-full object-contain" />
              <div className="absolute bottom-6 right-6 flex gap-2">
                <a 
                  href={generatedUrl} 
                  download="skin-visual.png"
                  className="bg-white/90 backdrop-blur shadow-lg p-3 rounded-xl hover:bg-white transition-colors text-slate-800"
                >
                  <Download className="w-6 h-6" />
                </a>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-12 text-center">
              <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-6">
                <ImageIcon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-600">No image generated yet</h3>
              <p className="max-w-xs mt-2">Adjust your prompt and aspect ratio, then click generate to create a new skin visual.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
