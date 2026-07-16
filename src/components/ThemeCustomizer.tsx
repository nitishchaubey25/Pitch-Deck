import React from 'react';
import { THEMES } from '../themes';
import { ThemeId } from '../types';
import { Palette, Layers } from 'lucide-react';

interface ThemeCustomizerProps {
  currentThemeId: ThemeId;
  onThemeChange: (themeId: ThemeId) => void;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  currentThemeId,
  onThemeChange
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm" id="theme-customizer-container">
      <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
        <Palette className="w-4 h-4 text-indigo-600" />
        <span>Slide Theme Engine</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.values(THEMES).map((theme) => {
          const isSelected = theme.id === currentThemeId;
          return (
            <button
              key={theme.id}
              id={`theme-btn-${theme.id}`}
              onClick={() => onThemeChange(theme.id)}
              className={`relative flex flex-col justify-between p-3.5 rounded-xl border text-left cursor-pointer transition active:scale-95 ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="space-y-1.5">
                <span className={`text-xs font-bold flex items-center gap-1.5 ${isSelected ? 'text-indigo-700' : 'text-slate-700'}`}>
                  {theme.name}
                </span>
                
                {/* Simulated color pills */}
                <div className="flex items-center gap-1 pt-1">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-slate-200"
                    style={{ backgroundColor: theme.accentHex }}
                  />
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-slate-200"
                    style={{ backgroundColor: theme.secondaryHex }}
                  />
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-slate-200 bg-slate-900"
                  />
                </div>
              </div>

              {/* Theme description badge */}
              <div className={`mt-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest pt-2 border-t ${isSelected ? 'border-indigo-200 text-indigo-500' : 'border-slate-200 text-slate-400'}`}>
                <span>{theme.fontFamily.replace('font-', '')}</span>
                {isSelected && (
                  <span className="font-bold text-indigo-600">ACTIVE</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
