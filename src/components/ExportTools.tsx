import React, { useState } from 'react';
import { Slide, PitchDeck } from '../types';
import { FileText, Copy, Check, Download, Printer, Share2 } from 'lucide-react';

interface ExportToolsProps {
  slides: Slide[];
  companyName: string;
  tagline: string;
}

export const ExportTools: React.FC<ExportToolsProps> = ({
  slides,
  companyName,
  tagline
}) => {
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  // 1. Compile Markdown Content
  const generateMarkdown = () => {
    let md = `# ${companyName}\n`;
    md += `*${tagline}*\n\n`;
    md += `Generated via React Pitch Deck Generator\n`;
    md += `==========================================\n\n`;

    slides.forEach((slide, idx) => {
      md += `## Slide ${idx + 1}: ${slide.title}\n`;
      if (slide.subtitle) {
        md += `*${slide.subtitle}*\n\n`;
      }

      md += `### Highlights:\n`;
      slide.bullets.forEach((bullet) => {
        md += `- ${bullet}\n`;
      });
      md += `\n`;

      if (slide.layoutType === 'metrics_grid' && slide.metrics) {
        md += `### Core Metrics:\n`;
        slide.metrics.forEach((m) => {
          md += `- **${m.label}**: ${m.value}\n`;
        });
        md += `\n`;
      }

      if (slide.layoutType === 'competitor_matrix' && slide.competitors) {
        md += `### Competitive Comparison:\n`;
        slide.competitors.forEach((c) => {
          md += `- **${c.name}** supports: ${c.features.join(', ') || 'None'}\n`;
        });
        md += `\n`;
      }

      if (slide.layoutType === 'team_grid' && slide.teamMembers) {
        md += `### Team Members:\n`;
        slide.teamMembers.forEach((t) => {
          md += `- **${t.name}** (${t.role}): ${t.bio}\n`;
        });
        md += `\n`;
      }

      md += `---\n\n`;
    });

    return md;
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdown();
    navigator.clipboard.writeText(md).then(() => {
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
    });
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${companyName.replace(/\s+/g, '_')}_pitch_deck.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyJSON = () => {
    const backup: PitchDeck = { companyName, tagline, slides };
    navigator.clipboard.writeText(JSON.stringify(backup, null, 2)).then(() => {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm" id="export-tools-container">
      <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-3">
        <Share2 className="w-4 h-4 text-indigo-600" />
        <span>Export Presentation &amp; Backups</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Print to PDF */}
        <button
          onClick={handlePrint}
          id="print-pdf-btn"
          className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-wide uppercase transition cursor-pointer active:scale-95 shadow-md shadow-indigo-600/10"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export PDF</span>
        </button>

        {/* Copy Markdown */}
        <button
          onClick={handleCopyMarkdown}
          id="copy-md-btn"
          className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs tracking-wide uppercase transition cursor-pointer active:scale-95"
        >
          {copiedMd ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600">Copied MD!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-500" />
              <span>Copy Markdown</span>
            </>
          )}
        </button>

        {/* Download MD file */}
        <button
          onClick={handleDownloadMarkdown}
          id="download-md-btn"
          className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs tracking-wide uppercase transition cursor-pointer active:scale-95"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Download MD File</span>
        </button>

        {/* JSON Backup */}
        <button
          onClick={handleCopyJSON}
          id="copy-json-btn"
          className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs tracking-wide uppercase transition cursor-pointer active:scale-95"
        >
          {copiedJson ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600">Copied JSON!</span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Backup JSON Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="text-[10px] text-slate-500 leading-relaxed pt-2 border-t border-slate-100 font-mono">
        <span className="font-bold text-indigo-600">Pro Tip:</span> Clicking &quot;Print / Export PDF&quot; opens your standard browser print dialogue. Set the print destination to &quot;Save as PDF&quot;, check the &quot;Print backgrounds&quot; checkbox, and hide headers/footers for a flawless, edge-to-edge layout slide presentation.
      </div>
    </div>
  );
};
