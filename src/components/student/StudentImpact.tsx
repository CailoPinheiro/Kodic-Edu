'use client';

import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface StudentImpactProps {
  impactNotifications?: any[];
  impactTriggered?: boolean;
}

export function StudentImpact({
  impactNotifications = [],
  impactTriggered = false
}: StudentImpactProps) {
  const { theme: t } = useTheme();

  return (
    <div className="p-5 space-y-5 animate-in fade-in pb-24">
      <div className={`${t.card} rounded-3xl p-5 flex flex-col items-center text-center transition-colors`}>
        <div className="w-12 h-12 bg-pink-500/10 rounded-full flex items-center justify-center mb-3">
          <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
        </div>
        <h2 className={`${t.textMain} font-bold text-lg mb-1`}>Impacto Silencioso (Gratidão Privada)</h2>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 ${t.textMuted} mb-3 uppercase tracking-wider`}>
          Sem Curtidas Públicas
        </span>
        <p className={`${t.textMuted} text-xs leading-relaxed max-w-xs mx-auto`}>
          O bem que você faz pela escola, mostrado apenas para você. Celebre sua utilidade real, sem comparações sociais e métricas de vaidade.
        </p>
      </div>

      <div className="space-y-3">
        {impactTriggered && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 to-transparent border border-emerald-500/30 animate-in slide-in-from-left-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded uppercase">
                Privado
              </span>
              <span className={`${t.textMain} text-xs font-bold`}>Impacto no Aprendizado</span>
            </div>
            <p className={`${t.textMuted} text-xs leading-relaxed`}>
              Sua resposta rápida garantiu <span className="font-bold text-emerald-500">+50 pontos</span> para a Meta Coletiva da sua turma!
            </p>
          </div>
        )}

        {impactNotifications && impactNotifications.length > 0 ? (
          impactNotifications.map((notif: any, i: number) => {
            const borderCol = i % 2 === 0 ? 'border-fuchsia-500' : 'border-orange-500';
            return (
              <div key={notif.id || i} className={`p-4 rounded-2xl ${t.cardSub} border-l-4 ${borderCol} transition-colors`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-500 px-1.5 py-0.5 rounded uppercase">
                    Privado
                  </span>
                  <span className={`${t.textMain} text-xs font-bold`}>{notif.title}</span>
                </div>
                <p className={`${t.textMuted} text-xs leading-relaxed`}>{notif.text}</p>
              </div>
            );
          })
        ) : (
          <>
            <div className={`p-4 rounded-2xl ${t.cardSub} border-l-4 border-fuchsia-500 transition-colors`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-500 px-1.5 py-0.5 rounded uppercase">
                  Privado
                </span>
                <span className={`${t.textMain} text-xs font-bold`}>Caderno Compartilhado</span>
              </div>
              <p className={`${t.textMuted} text-xs leading-relaxed`}>
                O mapa mental que você fotografou ajudou <span className="font-bold text-fuchsia-500">6 colegas</span> a estudarem para a prova.
              </p>
            </div>

            <div className={`p-4 rounded-2xl ${t.cardSub} border-l-4 border-orange-500 transition-colors`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-500 px-1.5 py-0.5 rounded uppercase">
                  Privado
                </span>
                <span className={`${t.textMain} text-xs font-bold`}>Mentoria Solidária Global</span>
              </div>
              <p className={`${t.textMuted} text-xs leading-relaxed`}>
                Seu quiz de Frações foi concluído por <span className="font-bold text-orange-500">12 alunos do 6º Ano</span> hoje.
              </p>
            </div>
          </>
        )}
      </div>

      <div className={`p-5 rounded-3xl ${t.primaryGrad} text-white text-center shadow-lg transition-all`}>
        <Sparkles className="w-6 h-6 mx-auto mb-2 text-fuchsia-200" />
        <h3 className="font-bold text-sm mb-1">Saúde Mental Preservada</h3>
        <p className="text-[10px] text-fuchsia-100 max-w-xs mx-auto leading-relaxed">
          Somente você tem acesso a esses dados. O foco é a sua evolução e utilidade real, sem comparações sociais tóxicas.
        </p>
      </div>
    </div>
  );
}
