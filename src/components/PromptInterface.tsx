import React, { useState } from 'react';
import { Sparkles, Key, Code, Smartphone, Cpu, Users, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface PromptInterfaceProps {
  onGenerate: (prompt: string, customApiKey: string) => void;
  isLoading: boolean;
  statusText: string;
}

const SAMPLE_PROMPTS = [
  {
    type: 'saas' as const,
    label: 'SaaS Platform',
    icon: Code,
    text: 'B2B AI-powered inventory forecasting software for medium-sized retail businesses.',
    desc: 'Supply chain automation platform',
    color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-300'
  },
  {
    type: 'mobile' as const,
    label: 'Mobile App',
    icon: Smartphone,
    text: 'A Tinder-style swipe interface for adopting shelter dogs with real-time video feeds.',
    desc: 'Consumer shelter match app',
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-300'
  },
  {
    type: 'hardware' as const,
    label: 'Hardware IoT',
    icon: Cpu,
    text: 'Smart Bluetooth mesh soil moisture sensor and automated drip-irrigation water meter.',
    desc: 'Smart home IoT agriculture',
    color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-300'
  },
  {
    type: 'social' as const,
    label: 'Social Network',
    icon: Users,
    text: 'Private audio-only huddle circles with chronologically ordered visual media sharing for designers.',
    desc: 'Ad-free human-first social circle',
    color: 'from-fuchsia-500/20 to-pink-500/20 border-fuchsia-500/30 text-fuchsia-300'
  }
];

export const PromptInterface: React.FC<PromptInterfaceProps> = ({
  onGenerate,
  isLoading,
  statusText
}) => {
  const [prompt, setPrompt] = useState('');
  const [customApiKey, setCustomApiKey] = useState(() => {
    return localStorage.getItem('user_gemini_api_key') || '';
  });
  const [showApiKey, setShowApiKey] = useState(false);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomApiKey(val);
    localStorage.setItem('user_gemini_api_key', val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onGenerate(prompt, customApiKey);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 px-4" id="prompt-interface-container">
      {/* Hero Header */}
      <div className="text-center space-y-3" id="hero-header-text">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3 h-3 animate-pulse text-indigo-500" />
          Silicon Valley Core
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-800">
          React Pitch Deck Generator
        </h1>
        <p className="text-slate-600 text-base max-w-2xl mx-auto font-medium">
          Type your startup idea and instantly generate professional, investor-ready pitch decks.
          Edits slides on the fly, customizes premium themes, and exports beautifully.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="relative rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6" id="prompt-form-card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              id="prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
              placeholder="Describe your product idea, business model, or market niche in detail..."
              rows={4}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 pr-12 text-slate-800 placeholder-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:bg-white disabled:opacity-55 outline-none transition text-base leading-relaxed resize-none font-medium"
            />
            <div className="absolute right-4 bottom-4 text-xs text-slate-400 font-mono font-semibold">
              {prompt.length} chars
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Key Trigger */}
            <div className="relative">
              <button
                type="button"
                id="toggle-api-key-btn"
                onClick={() => setShowApiKey(!showApiKey)}
                className="flex items-center gap-2 text-xs text-slate-500 hover:text-indigo-600 transition font-bold"
              >
                <Key className="w-3.5 h-3.5 text-indigo-600" />
                <span>
                  {customApiKey ? '✓ Custom Key Stored' : 'Add custom Gemini API Key (Optional)'}
                </span>
              </button>
              
              {showApiKey && (
                <div className="absolute left-0 top-7 z-10 w-72 p-4 rounded-xl border border-slate-200 bg-white shadow-xl space-y-3.5">
                  <div className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Saves locally in browser. If left empty, the generator uses the built-in server-side key!
                  </div>
                  <input
                    type="password"
                    id="api-key-input"
                    value={customApiKey}
                    onChange={handleApiKeyChange}
                    placeholder="Enter GEMINI_API_KEY..."
                    className="w-full text-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 focus:border-indigo-600 focus:bg-white outline-none font-medium"
                  />
                  {customApiKey && (
                    <button
                      type="button"
                      id="clear-api-key-btn"
                      onClick={() => {
                        setCustomApiKey('');
                        localStorage.removeItem('user_gemini_api_key');
                      }}
                      className="text-[10px] text-red-600 hover:underline font-bold"
                    >
                      Remove saved key
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Submit Trigger */}
            <button
              type="submit"
              id="generate-deck-btn"
              disabled={isLoading || !prompt.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none transition active:scale-95 cursor-pointer uppercase tracking-wider"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                  <span>Generating Deck...</span>
                </div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span>Generate Pitch Deck</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Loading Heuristics Progress */}
        {isLoading && (
          <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 space-y-3 animate-pulse animate-fade-in" id="loading-progress-bar">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-600 uppercase tracking-widest font-mono">
              <span>Heuristic & AI Engine</span>
              <span>Running</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full animate-shimmer" style={{ width: '70%' }} />
            </div>
            <p className="text-slate-600 text-sm italic font-mono text-center font-semibold">
              &quot;{statusText || 'Synthesizing seed milestones...'}&quot;
            </p>
          </div>
        )}

        {/* Suggestion Chips */}
        <div className="space-y-3 pt-2" id="suggested-chips-section">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Or select a sample business domain
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SAMPLE_PROMPTS.map((sample, idx) => {
              const IconComp = sample.icon;
              return (
                <button
                  key={idx}
                  id={`sample-prompt-btn-${idx}`}
                  type="button"
                  onClick={() => setPrompt(sample.text)}
                  disabled={isLoading}
                  className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer disabled:opacity-40"
                >
                  <div className="p-2 rounded-lg bg-white border border-slate-200 text-indigo-600 shadow-sm shrink-0">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      {sample.label}
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    </div>
                    <div className="text-xs text-slate-500 font-medium font-mono line-clamp-1">
                      {sample.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
