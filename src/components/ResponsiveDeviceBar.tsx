'use client';

import React from 'react';
import { Smartphone, Tablet, RotateCcw } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface ResponsiveDeviceBarProps {
  deviceWidth: number;
  setDeviceWidth: (width: number) => void;
  onReset: () => void;
}

export function ResponsiveDeviceBar({
  deviceWidth,
  setDeviceWidth,
  onReset
}: ResponsiveDeviceBarProps) {
  const { isDarkMode } = useTheme();

  const presets = [
    { label: '320px', width: 320, icon: Smartphone, name: 'Pequeno' },
    { label: '375px', width: 375, icon: Smartphone, name: 'SE' },
    { label: '400px', width: 400, icon: Smartphone, name: 'Padrão' },
    { label: '480px', width: 480, icon: Smartphone, name: 'Plus' },
    { label: '640px', width: 640, icon: Tablet, name: 'Fold' },
    { label: '768px', width: 768, icon: Tablet, name: 'Tablet' }
  ];

  return (
    <div className={`mb-3 w-full max-w-2xl px-3 py-2 rounded-2xl border shadow-lg backdrop-blur-md transition-colors flex flex-wrap items-center justify-between gap-2 z-30 ${
      isDarkMode
        ? 'bg-slate-900/90 border-violet-800/60 text-slate-200'
        : 'bg-white/95 border-violet-200 text-slate-700 shadow-slate-200/50'
    }`}>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400 font-bold text-xs">
          <Smartphone className="w-3.5 h-3.5 text-fuchsia-500" />
          <span>Largura</span>
        </div>

        <div className="flex items-center gap-1 bg-black/10 dark:bg-black/40 px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all">
          <span className="text-fuchsia-500">{deviceWidth}</span>
          <span className="text-slate-400 text-[10px]">× 840 px</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-1 max-w-[180px] min-w-[130px]">
        <Smartphone className="w-3.5 h-3.5 shrink-0 text-slate-400" />
        <input
          type="range"
          min="320"
          max="800"
          value={deviceWidth}
          onChange={(e) => setDeviceWidth(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
        />
      </div>

      <div className="flex items-center gap-1">
        {presets.map((p) => {
          const isActive = Math.abs(deviceWidth - p.width) <= 10;
          return (
            <button
              key={p.width}
              onClick={() => setDeviceWidth(p.width)}
              title={`${p.name} (${p.width}px)`}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-xs'
                  : isDarkMode
                  ? 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  : 'bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {p.label}
            </button>
          );
        })}

        <button
          onClick={onReset}
          title="Restaurar padrão (400px)"
          className="p-1.5 rounded-lg text-slate-400 hover:text-fuchsia-500 hover:bg-fuchsia-500/10 transition-colors ml-0.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
