import React, { useState } from 'react';
import { Slide, VisualTheme, MetricItem, CompetitorRow, TeamMember } from '../types';
import { 
  ArrowUp, ArrowDown, Trash2, Plus, Layout, Type, 
  BarChart3, LineChart as LineIcon, CheckSquare, Users2, 
  Milestone, ChevronLeft, ChevronRight, Check, X, Edit3, HelpCircle 
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';

interface PresentationViewerProps {
  slides: Slide[];
  theme: VisualTheme;
  onUpdateSlides: (updated: Slide[]) => void;
  selectedSlideIndex: number;
  onSelectSlideIndex: (index: number) => void;
}

export const PresentationViewer: React.FC<PresentationViewerProps> = ({
  slides,
  theme,
  onUpdateSlides,
  selectedSlideIndex,
  onSelectSlideIndex
}) => {
  const currentSlide = slides[selectedSlideIndex];
  const [editingField, setEditingField] = useState<{ id: string; field: string; index?: number } | null>(null);

  // Fallback if no slides loaded yet
  if (!currentSlide) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-400" id="no-slides-fallback">
        <HelpCircle className="w-12 h-12 mb-2 stroke-1 animate-pulse" />
        <p>No presentation deck generated yet.</p>
      </div>
    );
  }

  // --- Slide Operations ---
  const handleUpdateSlideField = (field: keyof Slide, value: any) => {
    const updated = [...slides];
    updated[selectedSlideIndex] = {
      ...currentSlide,
      [field]: value
    };
    onUpdateSlides(updated);
  };

  const handleMoveUp = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === 0) return;
    const updated = [...slides];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    onUpdateSlides(updated);
    onSelectSlideIndex(index - 1);
  };

  const handleMoveDown = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === slides.length - 1) return;
    const updated = [...slides];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    onUpdateSlides(updated);
    onSelectSlideIndex(index + 1);
  };

  const handleDeleteSlide = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (slides.length <= 1) {
      alert("A presentation must contain at least one slide.");
      return;
    }
    const updated = slides.filter((_, i) => i !== index);
    onUpdateSlides(updated);
    const nextIndex = selectedSlideIndex >= updated.length ? updated.length - 1 : selectedSlideIndex;
    onSelectSlideIndex(nextIndex);
  };

  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      title: "New Slide Title",
      subtitle: "A description of this new slide",
      bullets: [
        "First standard bullet point detailing the milestone",
        "Second bullet point showcasing the opportunity",
        "Third bullet point summarizing the core strategy"
      ],
      layoutType: "text_only"
    };
    const updated = [...slides];
    updated.splice(selectedSlideIndex + 1, 0, newSlide);
    onUpdateSlides(updated);
    onSelectSlideIndex(selectedSlideIndex + 1);
  };

  // --- Inline Editors ---
  const renderInlineInput = (
    value: string, 
    id: string, 
    field: string, 
    index?: number, 
    isTextArea = false,
    className = ""
  ) => {
    const isEditing = editingField?.id === id && editingField?.field === field && editingField?.index === index;

    if (isEditing) {
      if (isTextArea) {
        return (
          <textarea
            autoFocus
            id={`inline-textarea-${id}-${field}`}
            value={value}
            onChange={(e) => {
              if (index !== undefined) {
                // Bullet list or arrays
                const bullets = [...currentSlide.bullets];
                bullets[index] = e.target.value;
                handleUpdateSlideField('bullets', bullets);
              } else {
                handleUpdateSlideField(field as keyof Slide, e.target.value);
              }
            }}
            onBlur={() => setEditingField(null)}
            className="w-full bg-slate-950 text-slate-100 rounded p-2 border border-indigo-500 outline-none text-sm leading-relaxed"
          />
        );
      }
      return (
        <input
          autoFocus
          id={`inline-input-${id}-${field}`}
          type="text"
          value={value}
          onChange={(e) => {
            if (index !== undefined) {
              const bullets = [...currentSlide.bullets];
              bullets[index] = e.target.value;
              handleUpdateSlideField('bullets', bullets);
            } else {
              handleUpdateSlideField(field as keyof Slide, e.target.value);
            }
          }}
          onBlur={() => setEditingField(null)}
          className="w-full bg-slate-950 text-slate-100 rounded px-2 py-1 border border-indigo-500 outline-none font-bold"
        />
      );
    }

    return (
      <div 
        id={`inline-static-${id}-${field}`}
        onClick={() => setEditingField({ id, field, index })}
        className={`group relative cursor-pointer hover:bg-indigo-500/10 hover:border-dashed hover:border hover:border-indigo-400 rounded transition duration-150 p-0.5 ${className}`}
      >
        <span>{value || "Click to add text..."}</span>
        <Edit3 className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-indigo-400 transition" />
      </div>
    );
  };

  // --- Slide Components Layouter ---
  const renderSlideContent = () => {
    switch (currentSlide.layoutType) {
      case 'metrics_grid': {
        const metrics = currentSlide.metrics || [
          { label: "TAM", value: "$12B" },
          { label: "CAGR", value: "28%" },
          { label: "Growth", value: "High" }
        ];
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-auto pt-6" id="metrics-grid-layout">
            {metrics.map((m, idx) => (
              <div 
                key={idx} 
                id={`metric-box-${idx}`}
                className={`p-6 rounded-xl border ${theme.borderClass} ${theme.glowEffect} bg-black/25 flex flex-col justify-center text-center`}
              >
                <div 
                  className="text-3xl md:text-4xl font-extrabold tracking-tight"
                  style={{ color: theme.accentHex }}
                >
                  {m.value}
                </div>
                <div className="text-xs uppercase tracking-wider text-slate-400 mt-2 font-mono">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        );
      }

      case 'chart_line': {
        const rawMetrics = currentSlide.metrics || [];
        // Map user labels and numeric strings for Chart safely
        const chartData = rawMetrics.map((m) => ({
          name: m.label,
          Value: parseFloat(m.value.replace(/[^0-9.]/g, '')) || 0
        }));

        return (
          <div className="pt-6" id="chart-line-layout">
            <div className="h-56 w-full bg-black/15 p-3 rounded-xl border border-slate-800">
              {chartData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-xs text-slate-500 font-mono">
                  No chart data. Edit below in settings.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                    <Line 
                      type="monotone" 
                      dataKey="Value" 
                      stroke={theme.accentHex} 
                      strokeWidth={3} 
                      activeDot={{ r: 8 }} 
                      dot={{ fill: theme.secondaryHex }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
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
          <div className="pt-6" id="chart-bar-layout">
            <div className="h-56 w-full bg-black/15 p-3 rounded-xl border border-slate-800">
              {chartData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-xs text-slate-500 font-mono">
                  No chart data. Edit below in settings.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                    <Bar dataKey="Value" fill={theme.accentHex} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        );
      }

      case 'two_column': {
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6" id="two-column-layout">
            {/* Left */}
            <div className="space-y-3">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-mono">
                Key Bullet Points
              </div>
              <ul className="space-y-2">
                {currentSlide.bullets.map((bullet, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: theme.accentHex }} />
                    {renderInlineInput(bullet, currentSlide.id, 'bullets', index, true, theme.textBodyClass)}
                  </li>
                ))}
              </ul>
            </div>
            {/* Right highlight */}
            <div className="p-5 rounded-xl bg-black/25 border border-slate-800/40 flex flex-col justify-center space-y-3">
              <div 
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: theme.accentHex }}
              >
                Value Proposition
              </div>
              <p className="text-sm font-semibold italic text-slate-200 leading-relaxed">
                &quot;Simplifying delivery by bypassing intermediate legacy pipelines to connect customers instantly.&quot;
              </p>
              <div className="text-[11px] text-slate-400 leading-relaxed">
                By maintaining structured end-to-end cloud coordination we lower deployment costs and scale up user-authored speed efficiently.
              </div>
            </div>
          </div>
        );
      }

      case 'competitor_matrix': {
        const competitors = currentSlide.competitors || [
          { name: "Our Solution", us: true, features: ["Feature A", "Feature B", "Feature C"] },
          { name: "Competitor Legacy", us: false, features: ["Feature A"] },
          { name: "Custom Spreadsheets", us: false, features: ["Feature B"] }
        ];

        // Gather all distinct feature lists
        const allFeatures = Array.from(
          new Set(competitors.flatMap((c) => c.features))
        );

        return (
          <div className="pt-4 overflow-x-auto" id="competitor-matrix-layout">
            <table className="w-full text-left border-collapse text-xs md:text-sm font-sans">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="py-2.5 font-bold text-slate-400">Features / Competitors</th>
                  {competitors.map((c, idx) => (
                    <th 
                      key={idx} 
                      className={`py-2.5 px-3 font-extrabold ${c.us ? 'text-indigo-400 bg-indigo-500/5' : 'text-slate-200'}`}
                    >
                      {c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((f, fIdx) => (
                  <tr key={fIdx} className="border-b border-slate-800/50 hover:bg-white/5 transition">
                    <td className="py-2.5 text-slate-300 font-medium">{f}</td>
                    {competitors.map((c, cIdx) => {
                      const hasFeature = c.features.includes(f);
                      return (
                        <td key={cIdx} className={`py-2.5 px-3 ${c.us ? 'bg-indigo-500/5' : ''}`}>
                          {hasFeature ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <X className="w-4 h-4 text-rose-500" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      case 'team_grid': {
        const members = currentSlide.teamMembers || [
          { name: "John Doe", role: "CEO & Founder", bio: "Former Stripe Tech Lead." },
          { name: "Jane Smith", role: "CTO & Co-Founder", bio: "Deep tech CS PhD." }
        ];

        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6" id="team-grid-layout">
            {members.map((member, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-xl border border-slate-800/60 bg-black/20 flex gap-4 items-start"
                id={`team-member-card-${idx}`}
              >
                {/* Simulated Avatar */}
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 border border-slate-700 shrink-0 font-bold uppercase">
                  {member.name.charAt(0)}
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-slate-100">{member.name}</div>
                  <div 
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: theme.accentHex }}
                  >
                    {member.role}
                  </div>
                  <div className="text-[11px] text-slate-400 leading-relaxed">
                    {member.bio}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      }

      case 'timeline': {
        const milestones = currentSlide.metrics || [
          { label: "Q1 Launch", value: "Month 1" },
          { label: "10 Pilots", value: "Month 4" },
          { label: "Monetize", value: "Month 7" },
          { label: "Scale-up", value: "Month 12" }
        ];

        return (
          <div className="pt-8" id="timeline-layout">
            <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              {/* Vertical line for mobile, horizontal for desktop */}
              <div className="absolute left-4 top-0 bottom-0 md:left-0 md:right-0 md:top-1/2 md:h-0.5 bg-slate-800 -translate-y-1/2" />

              {milestones.map((m, idx) => (
                <div 
                  key={idx} 
                  className="relative pl-10 md:pl-0 md:text-center flex-1 flex flex-col md:items-center space-y-2 z-10"
                  id={`timeline-node-${idx}`}
                >
                  {/* Dot */}
                  <div 
                    className="absolute left-2.5 top-1.5 md:relative md:left-0 md:top-0 w-3.5 h-3.5 rounded-full border-2 border-slate-950 flex items-center justify-center"
                    style={{ backgroundColor: theme.accentHex }}
                  />
                  
                  <div className="space-y-1 pt-1 md:pt-2">
                    <div className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-widest">
                      {m.value}
                    </div>
                    <div className="text-xs font-extrabold text-slate-100 leading-snug">
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
          <div className="space-y-3 pt-4" id="text-only-layout">
            <ul className="space-y-2">
              {currentSlide.bullets.map((bullet, index) => (
                <li key={index} className="flex items-start gap-2.5 text-sm md:text-base leading-relaxed text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full mt-2.5 shrink-0" style={{ backgroundColor: theme.accentHex }} />
                  {renderInlineInput(bullet, currentSlide.id, 'bullets', index, true, theme.textBodyClass)}
                </li>
              ))}
            </ul>
          </div>
        );
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="presentation-viewer-workspace">
      
      {/* 1. Left Thumbnail Navigation */}
      <div className="lg:col-span-1 space-y-4" id="slide-thumbnail-navigator">
        <div className="flex items-center justify-between text-xs text-slate-500 uppercase tracking-widest font-bold">
          <span>Slides ({slides.length})</span>
          <button
            onClick={handleAddSlide}
            id="add-slide-btn"
            className="flex items-center gap-1 text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1.5 rounded-lg transition cursor-pointer shadow-sm font-semibold uppercase tracking-wider"
          >
            <Plus className="w-3 h-3" />
            <span>Add</span>
          </button>
        </div>

        <div className="max-h-[500px] overflow-y-auto space-y-2 pr-1" id="thumbnails-list">
          {slides.map((slide, idx) => {
            const isSelected = idx === selectedSlideIndex;
            return (
              <div
                key={slide.id}
                id={`thumbnail-card-${idx}`}
                onClick={() => onSelectSlideIndex(idx)}
                className={`group p-3.5 rounded-xl border text-left cursor-pointer transition relative flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="min-w-0">
                  <div className={`text-[10px] font-mono uppercase tracking-wider mb-1 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>
                    Slide {idx + 1} • {slide.layoutType.replace('_', ' ')}
                  </div>
                  <div className={`text-xs font-bold truncate pr-1 ${isSelected ? 'text-indigo-950 font-extrabold' : 'text-slate-800'}`}>
                    {slide.title}
                  </div>
                </div>

                {/* Thumbnails action controls */}
                <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition duration-150 bg-white/90 rounded-lg p-0.5 border border-slate-100 shadow-sm">
                  <button
                    onClick={(e) => handleMoveUp(idx, e)}
                    disabled={idx === 0}
                    className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleMoveDown(idx, e)}
                    disabled={idx === slides.length - 1}
                    className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteSlide(idx, e)}
                    className="p-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded cursor-pointer"
                    title="Delete Slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Main Slide Rendering Area */}
      <div className="lg:col-span-3 space-y-6" id="slide-main-workspace-section">
        {/* Frame / Viewport matching the Professional Polish mockup */}
        <div className="bg-slate-200/80 rounded-2xl p-6 md:p-10 border border-slate-300/30 shadow-inner flex flex-col items-center justify-center">
          {/* Slide Visual Card container */}
          <div 
            className={`rounded-xl border p-8 md:p-12 w-full max-w-[700px] aspect-video flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${theme.slideBgClass} ${theme.glowEffect} ${theme.fontFamily}`}
            id="active-slide-card"
          >
            {/* Subtle logo or branding top corner */}
            <div className="flex items-center justify-between mb-4">
              <span className={theme.badgeClass + " px-2.5 py-1 rounded text-[11px] font-mono tracking-widest uppercase font-extrabold"}>
                Slide {selectedSlideIndex + 1}
              </span>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                {slides[0]?.title || 'Pitch Deck'}
              </span>
            </div>

            <div className="space-y-4 my-auto">
              {/* Tagline / Subtitle header category */}
              <div className="space-y-1">
                <div className={theme.textSubtitleClass}>
                  {renderInlineInput(currentSlide.subtitle, currentSlide.id, 'subtitle', undefined, false, theme.textSubtitleClass)}
                </div>
                <h2 className={theme.textTitleClass}>
                  {renderInlineInput(currentSlide.title, currentSlide.id, 'title', undefined, false, theme.textTitleClass)}
                </h2>
              </div>

              {/* Layout Specific Widgets */}
              {renderSlideContent()}
            </div>

            {/* Footer of the card */}
            <div className="mt-4 pt-4 border-t border-slate-800/20 flex items-center justify-between text-[11px] text-slate-500 font-mono uppercase tracking-widest">
              <span>Confidential &amp; Proprietary</span>
              <span>{selectedSlideIndex + 1} / {slides.length}</span>
            </div>
          </div>
        </div>

        {/* 3. Slide Content & Dataset Inspector */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm" id="slide-inspector-panel">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <Layout className="w-4 h-4 text-indigo-600" />
              <span>Slide Inspector &amp; Layout Manager</span>
            </div>
            
            {/* Layout selector dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Layout Type:</span>
              <select
                id="layout-type-selector"
                value={currentSlide.layoutType}
                onChange={(e) => handleUpdateSlideField('layoutType', e.target.value)}
                className="bg-slate-50 text-xs border border-slate-200 text-slate-800 rounded px-2.5 py-1.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer font-medium"
              >
                <option value="text_only">Text Only</option>
                <option value="two_column">Two Columns</option>
                <option value="metrics_grid">Metrics Grid</option>
                <option value="chart_line">Line Chart</option>
                <option value="chart_bar">Bar Chart</option>
                <option value="competitor_matrix">Competitor Matrix</option>
                <option value="team_grid">Team Grid</option>
                <option value="timeline">Milestone Timeline</option>
              </select>
            </div>
          </div>

          {/* Dynamic Inputs depending on layout */}
          <div className="space-y-4 text-xs">
            {/* Bullet Point Manager */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-700">
                <span>Manage Slide Bullet Points</span>
                <button
                  id="add-bullet-btn"
                  onClick={() => {
                    const bullets = [...currentSlide.bullets, "New list detail entry"];
                    handleUpdateSlideField('bullets', bullets);
                  }}
                  className="flex items-center gap-1 bg-white border border-slate-200 text-[10px] px-2.5 py-1 rounded text-indigo-600 hover:bg-slate-50 cursor-pointer font-semibold uppercase tracking-wider"
                >
                  <Plus className="w-3 h-3" /> Add Point
                </button>
              </div>
              <div className="space-y-1.5">
                {currentSlide.bullets.map((b, bIdx) => (
                  <div key={bIdx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      id={`edit-bullet-input-${bIdx}`}
                      value={b}
                      onChange={(e) => {
                        const bullets = [...currentSlide.bullets];
                        bullets[bIdx] = e.target.value;
                        handleUpdateSlideField('bullets', bullets);
                      }}
                      className="flex-1 bg-slate-50 border border-slate-200 px-2.5 py-1.5 text-slate-800 rounded-lg text-xs outline-none focus:border-indigo-500 focus:bg-white"
                    />
                    <button
                      onClick={() => {
                        const bullets = currentSlide.bullets.filter((_, idx) => idx !== bIdx);
                        handleUpdateSlideField('bullets', bullets);
                      }}
                      id={`delete-bullet-btn-${bIdx}`}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                      title="Remove Bullet"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics Editor (for metrics, chart, timeline) */}
            {(currentSlide.layoutType === 'metrics_grid' || 
              currentSlide.layoutType === 'chart_line' || 
              currentSlide.layoutType === 'chart_bar' || 
              currentSlide.layoutType === 'timeline') && (
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between font-bold text-slate-700">
                  <span>
                    {currentSlide.layoutType.includes('chart') ? 'Chart Datasets' : 'Metrics & Timeline Details'}
                  </span>
                  <button
                    id="add-metric-row-btn"
                    onClick={() => {
                      const metrics = currentSlide.metrics || [];
                      const updated = [...metrics, { label: "New Node", value: "50" }];
                      handleUpdateSlideField('metrics', updated);
                    }}
                    className="flex items-center gap-1 bg-white border border-slate-200 text-[10px] px-2.5 py-1 rounded text-indigo-600 hover:bg-slate-50 cursor-pointer font-semibold uppercase tracking-wider"
                  >
                    <Plus className="w-3 h-3" /> Add Row
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                  {(currentSlide.metrics || []).map((m, mIdx) => (
                    <div key={mIdx} className="flex gap-2 items-center bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <input
                        type="text"
                        placeholder="Label"
                        value={m.label}
                        id={`metric-label-input-${mIdx}`}
                        onChange={(e) => {
                          const metrics = [...(currentSlide.metrics || [])];
                          metrics[mIdx] = { ...metrics[mIdx], label: e.target.value };
                          handleUpdateSlideField('metrics', metrics);
                        }}
                        className="w-1/2 bg-transparent text-slate-800 outline-none font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={m.value}
                        id={`metric-value-input-${mIdx}`}
                        onChange={(e) => {
                          const metrics = [...(currentSlide.metrics || [])];
                          metrics[mIdx] = { ...metrics[mIdx], value: e.target.value };
                          handleUpdateSlideField('metrics', metrics);
                        }}
                        className="w-1/3 bg-transparent text-slate-800 outline-none font-bold text-right"
                      />
                      <button
                        onClick={() => {
                          const metrics = (currentSlide.metrics || []).filter((_, idx) => idx !== mIdx);
                          handleUpdateSlideField('metrics', metrics);
                        }}
                        id={`delete-metric-row-btn-${mIdx}`}
                        className="text-rose-600 p-0.5 hover:bg-rose-50 rounded cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Competitor Matrix Editor */}
            {currentSlide.layoutType === 'competitor_matrix' && (
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between font-bold text-slate-700">
                  <span>Edit Matrix Competitors &amp; Features</span>
                  <button
                    id="add-competitor-btn"
                    onClick={() => {
                      const comps = currentSlide.competitors || [];
                      const updated = [...comps, { name: "Competitor B", us: false, features: ["Feature A"] }];
                      handleUpdateSlideField('competitors', updated);
                    }}
                    className="flex items-center gap-1 bg-white border border-slate-200 text-[10px] px-2.5 py-1 rounded text-indigo-600 hover:bg-slate-50 cursor-pointer font-semibold uppercase tracking-wider"
                  >
                    <Plus className="w-3 h-3" /> Add Competitor
                  </button>
                </div>
                
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {(currentSlide.competitors || []).map((c, cIdx) => (
                    <div key={cIdx} className="bg-slate-5 p-2.5 rounded-lg border border-slate-200 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={c.name}
                            id={`competitor-name-input-${cIdx}`}
                            onChange={(e) => {
                              const comps = [...(currentSlide.competitors || [])];
                              comps[cIdx] = { ...comps[cIdx], name: e.target.value };
                              handleUpdateSlideField('competitors', comps);
                            }}
                            className="bg-transparent text-slate-800 font-bold outline-none border-b border-transparent focus:border-indigo-500"
                          />
                          <label className="flex items-center gap-1.5 text-[10px] text-indigo-600 cursor-pointer font-bold">
                            <input
                              type="checkbox"
                              checked={c.us}
                              id={`competitor-us-checkbox-${cIdx}`}
                              onChange={(e) => {
                                const comps = [...(currentSlide.competitors || [])];
                                comps[cIdx] = { ...comps[cIdx], us: e.target.checked };
                                handleUpdateSlideField('competitors', comps);
                              }}
                              className="rounded bg-white border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>Us?</span>
                          </label>
                        </div>
                        <button
                          onClick={() => {
                            const comps = (currentSlide.competitors || []).filter((_, idx) => idx !== cIdx);
                            handleUpdateSlideField('competitors', comps);
                          }}
                          id={`delete-competitor-btn-${cIdx}`}
                          className="text-rose-600 hover:bg-rose-50 rounded p-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Tag feature entries comma separated */}
                      <div className="flex gap-1.5 items-center">
                        <span className="text-[10px] text-slate-500 shrink-0">Supported Features (Comma split):</span>
                        <input
                          type="text"
                          value={c.features.join(', ')}
                          id={`competitor-features-input-${cIdx}`}
                          onChange={(e) => {
                            const features = e.target.value.split(',').map(f => f.trim()).filter(Boolean);
                            const comps = [...(currentSlide.competitors || [])];
                            comps[cIdx] = { ...comps[cIdx], features };
                            handleUpdateSlideField('competitors', comps);
                          }}
                          className="flex-1 bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-[11px] text-slate-700 outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Team Grid Editor */}
            {currentSlide.layoutType === 'team_grid' && (
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between font-bold text-slate-700">
                  <span>Manage Executive Members</span>
                  <button
                    id="add-team-member-btn"
                    onClick={() => {
                      const members = currentSlide.teamMembers || [];
                      const updated = [...members, { name: "Sarah Vance", role: "VP Strategy", bio: "Ex-Google Business Lead." }];
                      handleUpdateSlideField('teamMembers', updated);
                    }}
                    className="flex items-center gap-1 bg-white border border-slate-200 text-[10px] px-2.5 py-1 rounded text-indigo-600 hover:bg-slate-50 cursor-pointer font-semibold uppercase tracking-wider"
                  >
                    <Plus className="w-3 h-3" /> Add Member
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto">
                  {(currentSlide.teamMembers || []).map((t, tIdx) => (
                    <div key={tIdx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <input
                          type="text"
                          value={t.name}
                          id={`team-member-name-${tIdx}`}
                          placeholder="Name"
                          onChange={(e) => {
                            const members = [...(currentSlide.teamMembers || [])];
                            members[tIdx] = { ...members[tIdx], name: e.target.value };
                            handleUpdateSlideField('teamMembers', members);
                          }}
                          className="bg-transparent text-slate-800 font-bold outline-none"
                        />
                        <button
                          onClick={() => {
                            const members = (currentSlide.teamMembers || []).filter((_, idx) => idx !== tIdx);
                            handleUpdateSlideField('teamMembers', members);
                          }}
                          id={`delete-team-member-${tIdx}`}
                          className="text-rose-600 hover:bg-rose-50 rounded p-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={t.role}
                        id={`team-member-role-${tIdx}`}
                        placeholder="Role"
                        onChange={(e) => {
                          const members = [...(currentSlide.teamMembers || [])];
                          members[tIdx] = { ...members[tIdx], role: e.target.value };
                          handleUpdateSlideField('teamMembers', members);
                        }}
                        className="w-full bg-white border border-slate-200 px-2 py-1 rounded-lg text-indigo-600 focus:border-indigo-500 font-semibold text-xs uppercase tracking-wider outline-none"
                      />
                      <textarea
                        value={t.bio}
                        id={`team-member-bio-${tIdx}`}
                        placeholder="Short bio"
                        rows={2}
                        onChange={(e) => {
                          const members = [...(currentSlide.teamMembers || [])];
                          members[tIdx] = { ...members[tIdx], bio: e.target.value };
                          handleUpdateSlideField('teamMembers', members);
                        }}
                        className="w-full bg-white border border-slate-200 px-2 py-1.5 rounded-lg text-[11px] text-slate-600 outline-none resize-none focus:border-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
