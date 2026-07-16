import React, { useEffect, useState } from 'react';
import { Slide, VisualTheme } from '../types';
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';

interface PresentationModeProps {
  slides: Slide[];
  theme: VisualTheme;
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  slides,
  theme,
  isOpen,
  onClose,
  initialIndex = 0
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  // Handle Keyboard Navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ': // Spacebar
          e.preventDefault();
          handleNext();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          handlePrev();
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, currentIndex, slides.length]);

  if (!isOpen) return null;

  const currentSlide = slides[currentIndex];
  if (!currentSlide) return null;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Click on slide split screen
  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const width = window.innerWidth;
    const clickX = e.clientX;
    // If click is in the left 35%, go back. If right 65%, go next.
    if (clickX < width * 0.35) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  // --- Slide Render Heuristics inside Fullscreen ---
  const renderPresenterContent = () => {
    switch (currentSlide.layoutType) {
      case 'metrics_grid': {
        const metrics = currentSlide.metrics || [];
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 md:pt-16 max-w-5xl mx-auto w-full" id="pres-metrics-grid">
            {metrics.map((m, idx) => (
              <div 
                key={idx} 
                className={`p-10 rounded-2xl border ${theme.borderClass} ${theme.glowEffect} bg-black/45 flex flex-col justify-center text-center`}
              >
                <div 
                  className="text-5xl md:text-6xl font-black tracking-tight"
                  style={{ color: theme.accentHex }}
                >
                  {m.value}
                </div>
                <div className="text-sm uppercase tracking-widest text-slate-400 mt-4 font-mono">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        );
      }

      case 'chart_line': {
        const rawMetrics = currentSlide.metrics || [];
        const chartData = rawMetrics.map((m) => ({
          name: m.label,
          Value: parseFloat(m.value.replace(/[^0-9.]/g, '')) || 0
        }));

        return (
          <div className="pt-10 max-w-4xl mx-auto w-full" id="pres-chart-line">
            <div className="h-72 w-full bg-black/25 p-5 rounded-2xl border border-slate-800">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.25} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={13} />
                  <YAxis stroke="#94a3b8" fontSize={13} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                  <Line 
                    type="monotone" 
                    dataKey="Value" 
                    stroke={theme.accentHex} 
                    strokeWidth={4} 
                    activeDot={{ r: 10 }} 
                    dot={{ fill: theme.secondaryHex, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      }

      case 'chart_bar': {
        const rawMetrics = currentSlide.metrics || [];
        const chartData = rawMetrics.map((m) => ({
          name: m.label,
          Value: parseFloat(m.value.replace(/[^0-9.]/g, '')) || 0
        }));

        return (
          <div className="pt-10 max-w-4xl mx-auto w-full" id="pres-chart-bar">
            <div className="h-72 w-full bg-black/25 p-5 rounded-2xl border border-slate-800">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.25} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={13} />
                  <YAxis stroke="#94a3b8" fontSize={13} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                  <Bar dataKey="Value" fill={theme.accentHex} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      }

      case 'two_column': {
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10 max-w-5xl mx-auto w-full text-left" id="pres-two-column">
            <div className="space-y-4">
              <ul className="space-y-4">
                {currentSlide.bullets.map((bullet, index) => (
                  <li key={index} className={`flex items-start gap-4 text-base md:text-lg leading-relaxed ${theme.textBodyClass}`}>
                    <span className="w-2.5 h-2.5 rounded-full mt-3 shrink-0" style={{ backgroundColor: theme.accentHex }} />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 rounded-2xl bg-black/35 border border-slate-800/40 flex flex-col justify-center space-y-4">
              <div 
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: theme.accentHex }}
              >
                Executive Vision
              </div>
              <p className="text-lg font-bold italic text-slate-100 leading-relaxed">
                &quot;Simplifying core delivery by bypassing intermediate legacy pipelines to scale with speed.&quot;
              </p>
              <div className="text-xs text-slate-400 leading-relaxed">
                By maintaining structured end-to-end cloud coordination we lower setup costs, maximize agility, and create high-retention feedback loops organically.
              </div>
            </div>
          </div>
        );
      }

      case 'competitor_matrix': {
        const competitors = currentSlide.competitors || [];
        const allFeatures = Array.from(new Set(competitors.flatMap((c) => c.features)));

        return (
          <div className="pt-8 max-w-4xl mx-auto w-full overflow-x-auto text-left" id="pres-competitor-matrix">
            <table className="w-full text-sm font-sans border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-800">
                  <th className="py-4 font-bold text-slate-400 text-base">Key Feature Sets</th>
                  {competitors.map((c, idx) => (
                    <th 
                      key={idx} 
                      className={`py-4 px-4 font-black text-base ${c.us ? 'text-indigo-400 bg-indigo-500/5' : 'text-slate-200'}`}
                    >
                      {c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((f, fIdx) => (
                  <tr key={fIdx} className="border-b border-slate-800/60 hover:bg-white/5 transition">
                    <td className="py-3.5 text-slate-200 font-medium text-sm md:text-base">{f}</td>
                    {competitors.map((c, cIdx) => (
                      <td key={cIdx} className={`py-3.5 px-4 ${c.us ? 'bg-indigo-500/5' : ''}`}>
                        {c.features.includes(f) ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <span className="text-emerald-400 text-xs font-bold">✓</span>
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                            <span className="text-rose-400 text-xs font-bold">✕</span>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      case 'team_grid': {
        const members = currentSlide.teamMembers || [];
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10 max-w-4xl mx-auto w-full text-left animate-fade-in" id="pres-team-grid">
            {members.map((member, idx) => (
              <div 
                key={idx} 
                className="p-6 rounded-2xl border border-slate-800/60 bg-black/35 flex gap-5 items-start"
              >
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 border border-slate-700 shrink-0 font-bold text-xl uppercase">
                  {member.name.charAt(0)}
                </div>
                <div className="space-y-1.5">
                  <div className="text-base font-bold text-white">{member.name}</div>
                  <div 
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: theme.accentHex }}
                  >
                    {member.role}
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed pt-1">
                    {member.bio}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      }

      case 'timeline': {
        const milestones = currentSlide.metrics || [];
        return (
          <div className="pt-16 max-w-5xl mx-auto w-full text-left" id="pres-timeline">
            <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-10">
              <div className="absolute left-6 top-0 bottom-0 md:left-0 md:right-0 md:top-1/2 md:h-1 bg-slate-800 -translate-y-1/2" />
              {milestones.map((m, idx) => (
                <div 
                  key={idx} 
                  className="relative pl-14 md:pl-0 md:text-center flex-1 flex flex-col md:items-center space-y-4 z-10"
                >
                  <div 
                    className="absolute left-4 top-2 md:relative md:left-0 md:top-0 w-5 h-5 rounded-full border-4 border-slate-950 flex items-center justify-center"
                    style={{ backgroundColor: theme.accentHex }}
                  />
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-400 font-mono uppercase tracking-widest">
                      {m.value}
                    </div>
                    <div className="text-sm md:text-base font-black text-slate-100">
                      {m.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      default: {
        return (
          <div className="space-y-4 pt-8 max-w-4xl mx-auto w-full text-left" id="pres-text-only">
            <ul className="space-y-4">
              {currentSlide.bullets.map((bullet, index) => (
                <li key={index} className={`flex items-start gap-4 text-base md:text-lg leading-relaxed ${theme.textBodyClass}`}>
                  <span className="w-2.5 h-2.5 rounded-full mt-3 shrink-0" style={{ backgroundColor: theme.accentHex }} />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      }
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col justify-between p-8 md:p-12 select-none overflow-hidden ${theme.slideBgClass} ${theme.fontFamily}`}
      onClick={handleScreenClick}
      id="presentation-fullscreen-overlay"
    >
      {/* Top Controls Header */}
      <div className="flex items-center justify-between border-b border-slate-800/40 pb-4 shrink-0 z-20">
        <div className="space-y-0.5 text-left">
          <div className="text-xs font-bold font-mono tracking-widest text-slate-500 uppercase">
            ACTIVE PRESENTATION MODE
          </div>
          <div className="text-sm font-semibold text-slate-300">
            {slides[0]?.title || 'Pitch Deck'}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <span className="text-xs text-slate-500 font-mono mr-2 hidden sm:inline">
            Use arrows, spacebar, or screen click to navigate
          </span>
          <button
            onClick={onClose}
            id="exit-presentation-btn"
            className="p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800/80 text-slate-400 hover:text-white transition cursor-pointer"
            title="Exit Presentation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Center Stage */}
      <div className="flex-1 flex flex-col justify-center text-center py-6 px-4 md:px-12 z-10" id="presenter-center-stage">
        <div className="max-w-5xl mx-auto w-full space-y-4">
          <div className={theme.textSubtitleClass + " tracking-widest font-extrabold uppercase"}>
            {currentSlide.subtitle}
          </div>
          <h1 className={theme.textTitleClass + " text-4xl md:text-6xl font-black leading-tight"}>
            {currentSlide.title}
          </h1>

          {renderPresenterContent()}
        </div>
      </div>

      {/* Bottom Controls bar */}
      <div 
        className="flex items-center justify-between border-t border-slate-800/40 pt-4 shrink-0 z-20"
        onClick={(e) => e.stopPropagation()}
        id="presentation-footer-navigation"
      >
        <span className="text-xs text-slate-500 font-mono tracking-wider">
          Confidential &amp; Proprietary
        </span>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            id="prev-slide-btn"
            disabled={currentIndex === 0}
            className="p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800/80 text-slate-300 disabled:opacity-20 transition cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-sm font-mono text-slate-400 font-bold">
            {currentIndex + 1} / {slides.length}
          </span>

          <button
            onClick={handleNext}
            id="next-slide-btn"
            disabled={currentIndex === slides.length - 1}
            className="p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800/80 text-slate-300 disabled:opacity-20 transition cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
