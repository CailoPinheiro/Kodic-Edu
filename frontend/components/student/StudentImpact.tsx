'use client';

import React from 'react';
import { Heart, Sparkles, FileText, Award, Zap } from 'lucide-react';
import { useTheme } from '@/frontend/context/ThemeContext';

interface StudentImpactProps {
  impactNotifications?: any[];
  impactTriggered?: boolean;
}

export function StudentImpact({
  impactNotifications = [],
  impactTriggered = false
}: StudentImpactProps) {
  const { isDarkMode, theme: t } = useTheme();

  return (
    <div className="p-5 space-y-4 animate-in fade-in pb-24">
      <div className={`${t.card} rounded-3xl p-5 flex flex-col items-center text-center shadow-md border border-pink-500/25 relative overflow-hidden transition-all`}>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="w-12 h-12 bg-pink-500/15 border border-pink-500/30 rounded-2xl flex items-center justify-center mb-2.5 shadow-sm">
          <Heart className="w-6 h-6 text-pink-500 fill-pink-500 animate-pulse" />
        </div>
        <h2 className={`${t.textMain} font-black text-lg mb-1`}>Impacto Silencioso</h2>
        <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-pink-500/15 text-pink-600 dark:text-pink-300 border border-pink-500/30 mb-2 uppercase tracking-wider">
          Gratidão Privada • Sem Curtidas Públicas
        </span>
        <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} text-xs leading-relaxed max-w-xs mx-auto font-medium`}>
          O bem que você faz pela escola, mostrado apenas para você. Celebre sua utilidade real, sem comparações sociais e sem métricas de vaidade.
        </p>
      </div>

      <div className="space-y-2.5">
        {impactTriggered && (
          <div className={`${t.card} p-3.5 rounded-2xl border-l-4 border-l-emerald-500 border border-emerald-500/25 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent shadow-sm animate-in slide-in-from-left-4 transition-all`}>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center flex-shrink-0 border border-emerald-500/25">
                  <Zap className="w-3 h-3 fill-emerald-500/40" />
                </div>
                <h4 className={`${t.textMain} text-xs font-bold`}>Impacto no Aprendizado</h4>
              </div>
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/25 uppercase tracking-wider">
                Privado
              </span>
            </div>
            <p className={`${isDarkMode ? 'text-slate-200' : 'text-slate-700'} text-[11px] leading-relaxed font-medium`}>
              Sua resposta rápida garantiu <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-1 py-0.5 rounded">+50 pontos</span> para a Meta Coletiva da sua turma!
            </p>
          </div>
        )}

        {impactNotifications && impactNotifications.length > 0 ? (
          impactNotifications.map((notif: any, i: number) => {
            const isEven = i % 2 === 0;
            const borderCol = isEven ? 'border-l-fuchsia-500 border-fuchsia-500/25' : 'border-l-amber-500 border-amber-500/25';
            const bgGrad = isEven
              ? 'bg-gradient-to-r from-fuchsia-500/10 via-fuchsia-500/5 to-transparent'
              : 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent';
            const badgeCol = isEven
              ? 'bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-300 border-fuchsia-500/25'
              : 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/25';
            const iconBg = isEven
              ? 'bg-fuchsia-500/15 text-fuchsia-500 border-fuchsia-500/25'
              : 'bg-amber-500/15 text-amber-500 border-amber-500/25';

            return (
              <div
                key={notif.id || i}
                className={`${t.card} p-3.5 rounded-2xl border-l-4 border ${borderCol} ${bgGrad} shadow-sm transition-all`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0 border`}>
                      {isEven ? <FileText className="w-3 h-3" /> : <Award className="w-3 h-3" />}
                    </div>
                    <h4 className={`${t.textMain} text-xs font-bold`}>{notif.title}</h4>
                  </div>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md ${badgeCol} border uppercase tracking-wider`}>
                    Privado
                  </span>
                </div>
                <p className={`${isDarkMode ? 'text-slate-200' : 'text-slate-700'} text-[11px] leading-relaxed font-medium`}>
                  {notif.text}
                </p>
              </div>
            );
          })
        ) : (
          <>
            <div className={`${t.card} p-3.5 rounded-2xl border-l-4 border-l-fuchsia-500 border border-fuchsia-500/25 bg-gradient-to-r from-fuchsia-500/10 via-fuchsia-500/5 to-transparent shadow-sm transition-all`}>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-fuchsia-500/15 text-fuchsia-500 flex items-center justify-center flex-shrink-0 border border-fuchsia-500/25">
                    <FileText className="w-3 h-3" />
                  </div>
                  <h4 className={`${t.textMain} text-xs font-bold`}>Caderno Compartilhado</h4>
                </div>
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-md bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-300 border border-fuchsia-500/25 uppercase tracking-wider">
                  Privado
                </span>
              </div>
              <p className={`${isDarkMode ? 'text-slate-200' : 'text-slate-700'} text-[11px] leading-relaxed font-medium`}>
                O mapa mental que você fotografou ajudou <span className="font-bold text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-500/15 px-1 py-0.5 rounded">6 colegas</span> a estudarem para a prova.
              </p>
            </div>

            <div className={`${t.card} p-3.5 rounded-2xl border-l-4 border-l-amber-500 border border-amber-500/25 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent shadow-sm transition-all`}>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center flex-shrink-0 border border-amber-500/25">
                    <Award className="w-3 h-3" />
                  </div>
                  <h4 className={`${t.textMain} text-xs font-bold`}>Mentoria Solidária Global</h4>
                </div>
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/25 uppercase tracking-wider">
                  Privado
                </span>
              </div>
              <p className={`${isDarkMode ? 'text-slate-200' : 'text-slate-700'} text-[11px] leading-relaxed font-medium`}>
                Seu quiz de Frações foi concluído por <span className="font-bold text-amber-600 dark:text-amber-400 bg-amber-500/15 px-1 py-0.5 rounded">12 alunos do 6º Ano</span> hoje.
              </p>
            </div>
          </>
        )}
      </div>

      <div className={`p-4 rounded-3xl ${t.primaryGrad} text-white text-center shadow-lg relative overflow-hidden transition-all`}>
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />
        <div className="relative z-10">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2 backdrop-blur-sm shadow-inner">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-black text-sm mb-1 tracking-tight">Seu Espaço de Paz</h3>
          <p className="text-[11px] text-violet-100 max-w-xs mx-auto leading-relaxed font-medium">
            Criado para você aprender sem pressão e celebrar o bem que faz pelos colegas, sem curtidas, rankings ou comparações.
          </p>
        </div>
      </div>
    </div>
  );
}
