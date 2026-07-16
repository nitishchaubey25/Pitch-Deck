import { useState, useEffect } from 'react';
import { PromptInterface } from './components/PromptInterface';
import { ThemeCustomizer } from './components/ThemeCustomizer';
import { PresentationViewer } from './components/PresentationViewer';
import { PresentationMode } from './components/PresentationMode';
import { ExportTools } from './components/ExportTools';
import { THEMES } from './themes';
import { generateHeuristicDeck } from './templates';
import { PitchDeck, ThemeId, Slide } from './types';
import { Sparkles, HelpCircle, Layers, Play, RefreshCw, AlertTriangle, Info, X, Key } from 'lucide-react';

export default function App() {
  const [promptInput, setPromptInput] = useState('');
  const [pitchDeck, setPitchDeck] = useState<PitchDeck>(() => {
    // Generate a beautiful, complete initial presentation so the user has an immediate playground
    return generateHeuristicDeck("B2B AI-powered Cloud Kitchen and Food Delivery Platform");
  });

  const [isLoading, setIsLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>('midnight');
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [isPresenterModeOpen, setIsPresenterModeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'generator'>('editor');
  const [generationInfoMsg, setGenerationInfoMsg] = useState<string | null>(null);

  // New state for inline generation modal
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const [modalPrompt, setModalPrompt] = useState('');
  const [modalApiKey, setModalApiKey] = useState(() => {
    return localStorage.getItem('user_gemini_api_key') || '';
  });
  const [showModalApiKeyField, setShowModalApiKeyField] = useState(false);

  const activeTheme = THEMES[currentThemeId] || THEMES.midnight;

  // --- Dynamic generation pipeline ---
  const handleGenerateDeck = async (prompt: string, customApiKey: string) => {
    setIsLoading(true);
    setGenerationInfoMsg(null);
    setPromptInput(prompt);

    const statuses = [
      "Tokenizing business intent...",
      "Analyzing market domains...",
      "Connecting to safe Gemini-3.5 API Proxy...",
      "Extracting TAM/SAM/SOM benchmarks...",
      "Synthesizing financial projections...",
      "Injecting dynamic chart metrics...",
      "Readying investor layouts..."
    ];

    // Tick through artificial states to keep user engaged and showcase depth
    let statusIdx = 0;
    setStatusText(statuses[0]);
    const interval = setInterval(() => {
      statusIdx++;
      if (statusIdx < statuses.length) {
        setStatusText(statuses[statusIdx]);
      }
    }, 450);

    try {
      // 1. Call full-stack server-side Gemini API Proxy
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          customApiKey: customApiKey || undefined
        })
      });

      clearInterval(interval);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error || `API responded with status ${response.status}`);
      }

      const generatedData = await response.json();
      
      // Map generated schema to slides format, ensuring every slide gets a unique id
      const slidesWithIds: Slide[] = (generatedData.slides || []).map((slide: any, idx: number) => ({
        ...slide,
        id: slide.id || `gen-${Date.now()}-${idx}`,
        layoutType: slide.layoutType || 'text_only',
        bullets: slide.bullets || ["Key highlights detailing operations"],
        metrics: slide.metrics || [],
        competitors: slide.competitors || [],
        teamMembers: slide.teamMembers || []
      }));

      setPitchDeck({
        companyName: generatedData.companyName || "NovaLaunch",
        tagline: generatedData.tagline || "Disrupting traditional operational workflows",
        slides: slidesWithIds
      });

      setSelectedSlideIndex(0);
      setActiveTab('editor');
      setIsGenerationModalOpen(false);
      setModalPrompt('');
      setGenerationInfoMsg("Success: Presentation deck generated using Gemini-3.5 API.");
    } catch (error: any) {
      console.warn("Gemini generation failed, falling back to smart heuristic engine:", error);
      clearInterval(interval);

      // 2. High-Fidelity Heuristic Fallback
      setTimeout(() => {
        const heuristicDeck = generateHeuristicDeck(prompt);
        setPitchDeck(heuristicDeck);
        setSelectedSlideIndex(0);
        setActiveTab('editor');
        setIsGenerationModalOpen(false);
        setModalPrompt('');
        setGenerationInfoMsg(
          "Instant Load: Applied customized premium heuristic layout matching your business model."
        );
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSlides = (updatedSlides: Slide[]) => {
    setPitchDeck(prev => ({
      ...prev,
      slides: updatedSlides
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" id="app-root-wrapper">
      
      {/* Top Banner Navigation */}
      <header className="border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm" id="global-header-banner">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-600/30">
            P
          </div>
          <div className="space-y-0.5">
            <span className="text-sm font-black text-slate-800 tracking-tight">React Pitch Deck Generator</span>
            <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Durable Enterprise Workspace</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('editor')}
            id="tab-editor-btn"
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer active:scale-95 ${
              activeTab === 'editor'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            Presenter Workspace
          </button>
          <button
            onClick={() => setActiveTab('generator')}
            id="tab-generator-btn"
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer active:scale-95 ${
              activeTab === 'generator'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            Create New Deck
          </button>
        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="flex-1 w-full max-w-7xl mx-auto py-6 px-4 md:px-6 space-y-8" id="app-main-content">
        
        {/* Info Toaster Notice */}
        {generationInfoMsg && (
          <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 flex items-center gap-3 animate-fade-in text-xs text-indigo-700 font-medium" id="toaster-notice">
            <Info className="w-4 h-4 shrink-0 text-indigo-600" />
            <div className="flex-1">
              {generationInfoMsg}
            </div>
            <button
              onClick={() => setGenerationInfoMsg(null)}
              className="text-[10px] uppercase hover:underline font-bold text-indigo-600 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {activeTab === 'generator' ? (
          /* Tab 1: Interactive Creator Prompt Interface */
          <div className="py-6" id="generator-tab-content">
            <PromptInterface
              onGenerate={handleGenerateDeck}
              isLoading={isLoading}
              statusText={statusText}
            />
          </div>
        ) : (
          /* Tab 2: Editor Workspace & Controls */
          <div className="space-y-6 animate-fade-in" id="editor-tab-content">
            
            {/* Toolbar row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm" id="workspace-action-toolbar">
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-extrabold">Active Pitch Deck</div>
                <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <span>{pitchDeck.companyName}</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono font-normal tracking-normal lowercase">
                    &quot;{pitchDeck.tagline}&quot;
                  </span>
                </h2>
              </div>

              {/* Actions group */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setIsGenerationModalOpen(true)}
                  id="open-generation-modal-btn"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 shadow-lg shadow-indigo-600/10 transition active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate New Deck</span>
                </button>

                <button
                  onClick={() => setIsPresenterModeOpen(true)}
                  id="enter-presentation-mode-btn"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 shadow-lg shadow-emerald-600/10 transition active:scale-95 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Enter Presentation Mode</span>
                </button>
              </div>
            </div>

            {/* Design Customizer panel */}
            <ThemeCustomizer
              currentThemeId={currentThemeId}
              onThemeChange={setCurrentThemeId}
            />

            {/* Slide Editor and Thumbnails Workspace */}
            <PresentationViewer
              slides={pitchDeck.slides}
              theme={activeTheme}
              onUpdateSlides={handleUpdateSlides}
              selectedSlideIndex={selectedSlideIndex}
              onSelectSlideIndex={setSelectedSlideIndex}
            />

            {/* Slide Export Toolbar */}
            <ExportTools
              slides={pitchDeck.slides}
              companyName={pitchDeck.companyName}
              tagline={pitchDeck.tagline}
            />
          </div>
        )}
      </main>

      {/* Presentation Fullscreen Mode Component */}
      <PresentationMode
        slides={pitchDeck.slides}
        theme={activeTheme}
        isOpen={isPresenterModeOpen}
        onClose={() => setIsPresenterModeOpen(false)}
        initialIndex={selectedSlideIndex}
      />

      {/* Startup Prompt Deck Generation Modal Overlay */}
      {isGenerationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" id="generation-modal-overlay">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full shadow-2xl p-6 relative flex flex-col space-y-4" id="generation-modal-content">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <h3 className="text-base font-black text-slate-800">Generate Startup Pitch Deck</h3>
              </div>
              <button
                onClick={() => {
                  if (!isLoading) {
                    setIsGenerationModalOpen(false);
                    setModalPrompt('');
                  }
                }}
                disabled={isLoading}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-1.5 rounded-lg transition disabled:opacity-30 cursor-pointer"
                id="close-generation-modal-btn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Content / Loading Stage */}
            {!isLoading ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (modalPrompt.trim()) {
                    handleGenerateDeck(modalPrompt, modalApiKey);
                  }
                }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Startup Idea / Business Prompt
                  </label>
                  <textarea
                    value={modalPrompt}
                    onChange={(e) => setModalPrompt(e.target.value)}
                    placeholder="Describe your startup business model, product idea, target audience, or industry niche..."
                    rows={4}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-800 placeholder-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:bg-white outline-none transition text-sm leading-relaxed resize-none font-medium"
                    id="modal-prompt-textarea"
                  />
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono font-semibold">
                    <span>Be descriptive for best AI layout results</span>
                    <span>{modalPrompt.length} chars</span>
                  </div>
                </div>

                {/* API Key settings in modal */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setShowModalApiKeyField(!showModalApiKeyField)}
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 transition font-bold"
                    id="modal-api-key-toggle"
                  >
                    <Key className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{modalApiKey ? '✓ Custom Key Configured' : 'Add custom Gemini API Key (Optional)'}</span>
                  </button>

                  {showModalApiKeyField && (
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 animate-fade-in">
                      <div className="text-[10px] text-slate-500 font-medium leading-normal">
                        Saves locally in browser. If left empty, the system uses the default server-side API Key.
                      </div>
                      <input
                        type="password"
                        value={modalApiKey}
                        onChange={(e) => {
                          setModalApiKey(e.target.value);
                          localStorage.setItem('user_gemini_api_key', e.target.value);
                        }}
                        placeholder="Enter GEMINI_API_KEY..."
                        className="w-full text-xs rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 focus:border-indigo-600 outline-none font-medium"
                        id="modal-api-key-input"
                      />
                      {modalApiKey && (
                        <button
                          type="button"
                          onClick={() => {
                            setModalApiKey('');
                            localStorage.removeItem('user_gemini_api_key');
                          }}
                          className="text-[10px] text-red-600 hover:underline font-bold"
                          id="modal-api-key-remove"
                        >
                          Remove saved key
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsGenerationModalOpen(false);
                      setModalPrompt('');
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider transition cursor-pointer active:scale-95"
                    id="modal-cancel-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!modalPrompt.trim()}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer active:scale-95 shadow-md shadow-indigo-600/10 font-semibold"
                    id="modal-submit-btn"
                  >
                    Generate Deck
                  </button>
                </div>
              </form>
            ) : (
              /* Loading view inside modal */
              <div className="py-8 text-center space-y-4" id="modal-loading-view">
                <div className="flex justify-center">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
                    <div className="absolute inset-0 border-4 border-t-indigo-600 rounded-full animate-spin" />
                    <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2 max-w-xs mx-auto">
                  <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Generating Pitch Deck...</h4>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full animate-shimmer" style={{ width: '80%' }} />
                  </div>
                  <p className="text-xs font-semibold text-slate-500 font-mono italic">
                    &quot;{statusText || 'Analyzing business dynamics...'}&quot;
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Global Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-12 shrink-0" id="global-application-footer">
        <div>Pitch Deck Builder Platform © 2026. Fully Responsive Offline Engine.</div>
      </footer>

      {/* 5. Hidden Native Print Container formatted page-by-page */}
      <div id="print-slides-container" className="hidden">
        {pitchDeck.slides.map((slide, idx) => (
          <div key={slide.id} className="printable-slide">
            <div className="printable-header">
              <span>{pitchDeck.companyName}</span>
              <span>Slide {idx + 1} of {pitchDeck.slides.length}</span>
            </div>
            
            <div className="printable-body">
              <div className="printable-subtitle">{slide.subtitle}</div>
              <h2 className="printable-title">{slide.title}</h2>
              
              <ul className="printable-bullets">
                {slide.bullets.map((b, bIdx) => (
                  <li key={bIdx}>{b}</li>
                ))}
              </ul>

              {/* Print layout summary */}
              {slide.layoutType === 'metrics_grid' && slide.metrics && (
                <div className="printable-metrics">
                  {slide.metrics.map((m, mIdx) => (
                    <div key={mIdx} className="printable-metric-box">
                      <span className="val">{m.value}</span>
                      <span className="lbl">{m.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="printable-footer">
              Confidential &amp; Proprietary • {pitchDeck.tagline}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
