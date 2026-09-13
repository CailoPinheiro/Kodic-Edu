'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, User, Crown, Award, Folder, Shield, Megaphone, CheckCircle2, Timer } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFocus?: () => void;
}

export function Drawer({ isOpen, onClose }: DrawerProps) {
  const { user, isStudent, isLeader, isTeacher, updateIntelligenceRole } = useAuth();
  const { isDarkMode, theme: t } = useTheme();

  const [focusTime, setFocusTime] = useState(25 * 60);
  const [isFocusActive, setIsFocusActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isFocusActive && focusTime > 0) {
      timerRef.current = setInterval(() => setFocusTime((prev) => prev - 1), 1000);
    } else if (focusTime === 0) {
      setIsFocusActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isFocusActive, focusTime]);

  if (!user) return null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentRole = user.intelligence_role || 'Curador';

  return (
    <div className={`absolute inset-0 z-50 flex ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      <div
        className={`absolute top-0 left-0 w-[85%] max-w-[340px] h-full ${t.card} shadow-2xl transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col z-10`}
      >
        <div className={`p-5 flex justify-between items-center border-b ${isDarkMode ? 'border-violet-800/50' : 'border-violet-100'}`}>
          <h2 className={`${t.textMain} font-bold text-lg`}>Menu & Identidade</h2>
          <button onClick={onClose} className={`p-2 rounded-full ${t.cardSub} transition-colors`}>
            <X className={`w-5 h-5 ${t.textMain}`} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full ${t.primaryGrad} p-1 shadow-md flex-shrink-0`}>
              <div className={`w-full h-full rounded-full ${isDarkMode ? 'bg-[#1C1242]' : 'bg-white'} flex items-center justify-center overflow-hidden select-none`}>
                {isStudent ? (
                  <span className="font-black text-2xl text-fuchsia-500">
                    {(user.name || 'A').trim().charAt(0).toUpperCase()}
                  </span>
                ) : user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-fuchsia-500" />
                )}
              </div>
            </div>
            <div>
              <h2 className={`${t.textMain} font-bold text-lg leading-snug`}>{user.name}</h2>
              {isLeader && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block bg-violet-500/20 text-violet-600 dark:text-violet-300">
                  Líder (Moderação Ativa)
                </span>
              )}
            </div>
          </div>

          <div>
            <h3 className={`${t.textMain} font-semibold text-sm mb-3`}>Sua Coleção de Selos (Badges)</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className={`${t.cardSub} p-3 rounded-2xl flex flex-col gap-1 items-start border border-violet-500/10`}>
                <Crown className="text-amber-500 w-5 h-5" />
                <h4 className={`${t.textMain} text-xs font-bold`}>{isStudent ? 'Líder de Turma' : 'Docente Inovador'}</h4>
              </div>
              <div className={`${t.cardSub} p-3 rounded-2xl flex flex-col gap-1 items-start border border-violet-500/10`}>
                <Award className="text-orange-500 w-5 h-5" />
                <h4 className={`${t.textMain} text-xs font-bold`}>{isStudent ? 'Mentor Ouro' : 'Mentor BNCC'}</h4>
              </div>
            </div>
          </div>

          {isStudent && (
            <div>
              <h3 className={`${t.textMain} font-semibold text-sm mb-3`}>Múltiplas Inteligências (Seu Papel)</h3>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => updateIntelligenceRole('Curador')}
                  className={`w-full p-3 rounded-xl border-2 transition-all flex justify-between items-center text-left ${
                    currentRole === 'Curador'
                      ? `border-fuchsia-500 ${isDarkMode ? 'bg-fuchsia-900/20' : 'bg-fuchsia-50'}`
                      : `${t.cardSub} opacity-70`
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4 text-fuchsia-500" />
                    <span className={`${t.textMain} text-xs font-bold`}>Curador de Conteúdo</span>
                  </div>
                  {currentRole === 'Curador' && <CheckCircle2 className="w-4 h-4 text-fuchsia-500" />}
                </button>

                <button
                  type="button"
                  onClick={() => updateIntelligenceRole('Revisor')}
                  className={`w-full p-3 rounded-xl border-2 transition-all flex justify-between items-center text-left ${
                    currentRole === 'Revisor'
                      ? `border-amber-500 ${isDarkMode ? 'bg-amber-900/20' : 'bg-amber-50'}`
                      : `${t.cardSub} opacity-70`
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-500" />
                    <span className={`${t.textMain} text-xs font-bold`}>Revisor Crítico</span>
                  </div>
                  {currentRole === 'Revisor' && <CheckCircle2 className="w-4 h-4 text-amber-500" />}
                </button>

                <button
                  type="button"
                  onClick={() => updateIntelligenceRole('Comunicador')}
                  className={`w-full p-3 rounded-xl border-2 transition-all flex justify-between items-center text-left ${
                    currentRole === 'Comunicador'
                      ? `border-pink-500 ${isDarkMode ? 'bg-pink-900/20' : 'bg-pink-50'}`
                      : `${t.cardSub} opacity-70`
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-pink-500" />
                    <span className={`${t.textMain} text-xs font-bold`}>Comunicador</span>
                  </div>
                  {currentRole === 'Comunicador' && <CheckCircle2 className="w-4 h-4 text-pink-500" />}
                </button>
              </div>
            </div>
          )}

          <div>
            <h3 className={`${t.textMain} font-semibold text-sm mb-3`}>Ferramenta Anti-Distração</h3>
            <div
              className={`${
                isFocusActive
                  ? isDarkMode
                    ? 'bg-emerald-900/30 border-emerald-500/50'
                    : 'bg-emerald-50 border-emerald-200'
                  : t.cardSub
              } p-4 rounded-2xl border transition-colors flex flex-col items-center justify-center gap-3`}
            >
              <Timer className={`w-8 h-8 ${isFocusActive ? 'text-emerald-500' : t.textMuted}`} />
              <div className="text-center">
                <h4 className={`${t.textMain} font-bold text-2xl tracking-widest`}>{formatTime(focusTime)}</h4>
                <p className={`${t.textMuted} text-xs`}>
                  {isFocusActive ? 'Ciclo Pomodoro Ativo. Notificações silenciadas.' : 'Modo Foco (Pomodoro 25 min)'}
                </p>
              </div>
              <button
                onClick={() => setIsFocusActive(!isFocusActive)}
                className={`w-full py-2 rounded-xl text-xs font-bold shadow-md transition-all ${
                  isFocusActive ? 'bg-emerald-500 text-white' : `${t.primaryGrad} text-white`
                }`}
              >
                {isFocusActive ? 'Pausar Foco' : 'Iniciar Foco'}
              </button>
            </div>
          </div>

          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-200/50'} text-center border border-violet-500/10`}>
            <Shield className={`w-5 h-5 mx-auto mb-2 ${t.textMuted}`} />
            <h4 className={`${t.textMain} text-xs font-bold mb-1`}>Privacy by Design & LGPD</h4>
            <p className={`${t.textMuted} text-[10px] leading-relaxed`}>
              Dados escolares protegidos pela LGPD. Sem rastreamento invasivo ou monitoramento de aplicativos pessoais.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
