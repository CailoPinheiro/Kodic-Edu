'use client';

import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Zap, BellOff } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface StudentFocusProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StudentFocus({ isOpen, onClose }: StudentFocusProps) {
  const { theme: t } = useTheme();
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft]);

  if (!isOpen) return null;

  const toggleTimer = () => {
    const nextState = !isActive;
    setIsActive(nextState);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(25 * 60);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-sm ${t.card} rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center border-2 border-violet-500/30`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex justify-end">
          <button
            onClick={onClose}
            className={`p-2 rounded-full ${t.cardSub} ${t.textMain} hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-500 my-2">
          <Zap className="w-8 h-8" />
        </div>

        <h3 className={`${t.textMain} text-lg font-black tracking-tight`}>Modo Foco & Pomodoro</h3>
        <p className={`${t.textMuted} text-xs mt-1 max-w-[260px] leading-relaxed`}>
          Silencia notificações e garante imersão e concentração durante as atividades em sala de aula.
        </p>

        <div className={`text-5xl font-black font-mono tracking-widest ${t.textMain} my-6`}>
          {formattedTime}
        </div>

        <div className="flex items-center gap-3 w-full justify-center">
          <button
            onClick={toggleTimer}
            className={`flex-1 py-3 px-5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
              isActive
                ? 'bg-amber-500 text-black hover:bg-amber-400'
                : `${t.primaryGrad} text-white hover:brightness-110`
            }`}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isActive ? 'Pausar Ciclo' : 'Iniciar Foco (25m)'}</span>
          </button>

          <button
            onClick={resetTimer}
            className={`p-3 rounded-2xl border border-violet-500/20 ${t.cardSub} ${t.textMain} hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-500 mt-5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full font-semibold">
          <BellOff className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Notificações bloqueadas durante o ciclo</span>
        </div>
      </div>
    </div>
  );
}
