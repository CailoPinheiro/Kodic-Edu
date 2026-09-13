'use client';

import React, { useState } from 'react';
import { Users, Lock, Camera, FileText, Link as LinkIcon, User, RefreshCw, Smartphone } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface StudentGroupProps {
  sharedGroup: any;
  notebooks: any[];
  onDataChange: () => void;
}

export function StudentGroup({ sharedGroup, notebooks, onDataChange }: StudentGroupProps) {
  const { isDarkMode, theme: t } = useTheme();

  const [hubTab, setHubTab] = useState<'turma' | 'escola'>('turma');
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleRotateDevice = async () => {
    if (!sharedGroup || isRotating) return;
    setIsRotating(true);
    try {
      const token = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
      await fetch('/api/groups/rotate-device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ groupId: sharedGroup.id })
      });
      onDataChange();
    } catch {
    } finally {
      setIsRotating(false);
    }
  };

  const handleUploadNotebook = async () => {
    setIsUploading(true);
    try {
      const sampleTitles = [
        'Resolução Manuscrita: Análise de Bacias Hidrográficas',
        'Mapa Mental: Matrizes Energéticas e Sustentabilidade',
        'Caderno: Exercícios de Geopolítica Pós-1950'
      ];
      const randomTitle = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];

      const token = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
      await fetch('/api/content/notebooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: randomTitle,
          type: 'HANDWRITTEN_NOTEBOOK',
          badge: 'Foto de Caderno'
        })
      });

      onDataChange();
    } catch {
    } finally {
      setIsUploading(false);
    }
  };

  const groupName = sharedGroup?.name || 'Equipe Exploradores';
  const groupObjective = sharedGroup?.objective || 'Geografia • Profª. Cláudia • EM13CHS101';
  const members = sharedGroup?.members || [
    { name: 'Alex Silva', role: 'Curador', points: 480, isCurrentDeviceHolder: true },
    { name: 'Bia Santos', role: 'Revisora', points: 520, isCurrentDeviceHolder: false },
    { name: 'Carla Dias', role: 'Comunicadora', points: 430, isCurrentDeviceHolder: false },
    { name: 'Diego Alves', role: 'Curador', points: 460, isCurrentDeviceHolder: false }
  ];

  return (
    <div className="p-5 space-y-5 animate-in fade-in pb-24">
      <div className={`flex p-1 rounded-2xl ${t.cardSub}`}>
        <button
          onClick={() => setHubTab('turma')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
            hubTab === 'turma' ? `${t.card} shadow-sm ${t.textMain}` : t.textMuted
          }`}
        >
          Espaço da Turma
        </button>
        <button
          onClick={() => setHubTab('escola')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 ${
            hubTab === 'escola' ? `${t.card} shadow-sm ${t.textMain}` : t.textMuted
          }`}
        >
          <Lock className="w-3 h-3" /> Hub da Escola
        </button>
      </div>

      {hubTab === 'turma' ? (
        <>
          <div className={`${t.card} rounded-3xl p-5 relative transition-colors`}>
            <span className={`absolute -top-3 left-5 text-[9px] font-bold px-3 py-1 rounded-full ${t.primaryGrad} text-white shadow-md uppercase`}>
              {sharedGroup?.groupType || 'Oficial da Disciplina'}
            </span>
            <div className="mt-2">
              <h2 className={`${t.textMain} font-bold text-xl`}>{groupName}</h2>
              <p className={`${t.textMuted} text-xs mt-1 leading-relaxed`}>{groupObjective}</p>
            </div>
          </div>

          <div className={`${t.card} rounded-3xl p-5 border-2 border-fuchsia-500/50 transition-colors`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`${t.textMain} font-bold flex items-center gap-2 text-sm`}>
                <Users className="w-5 h-5 text-fuchsia-500" />
                Modo Compartilhado (4 em 1)
              </h3>
              <span className="bg-emerald-500/20 text-emerald-500 text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1 uppercase">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Sincronizado
              </span>
            </div>

            <div className={`p-4 rounded-2xl ${t.cardSub} mb-4 flex justify-between items-center border border-violet-500/10`}>
              <div>
                <p className={`${t.textMuted} text-[10px] uppercase font-bold tracking-wider mb-0.5`}>Rodízio Atual</p>
                <p className={`${t.textMain} text-sm font-bold`}>
                  {sharedGroup?.currentDeviceHolder || 'Alex Silva'}
                </p>
              </div>
              <button
                onClick={handleRotateDevice}
                disabled={isRotating}
                className="bg-fuchsia-500/15 hover:bg-fuchsia-500/25 text-fuchsia-600 dark:text-fuchsia-400 text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
                <span>Girar Posse</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {members.map((m: any, i: number) => {
                const isHolder = Boolean(m.isCurrentDeviceHolder);
                return (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border transition-all flex flex-col items-center text-center relative ${
                      isHolder
                        ? 'border-fuchsia-500 bg-fuchsia-500/10 shadow-sm'
                        : isDarkMode
                        ? 'border-violet-800/60 bg-white/5'
                        : 'border-violet-100 bg-slate-50'
                    }`}
                  >
                    {isHolder && (
                      <div className="absolute -top-2 bg-fuchsia-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow">
                        SEGURANDO
                      </div>
                    )}
                    <div
                      className={`w-9 h-9 rounded-full ${
                        isHolder ? t.primaryGrad : 'bg-slate-300 dark:bg-slate-700'
                      } mb-1.5 flex items-center justify-center overflow-hidden shadow-sm`}
                    >
                      {m.avatar ? (
                        <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <p className={`${t.textMain} text-xs font-bold truncate max-w-full`}>{m.name}</p>
                    <p className={`${t.textMuted} text-[10px]`}>{m.role}</p>
                    <div className="flex items-center justify-center gap-1 mt-1 flex-wrap">
                      <p className="text-[11px] font-black text-emerald-500">{m.points} pts</p>
                      {isHolder && (
                        <span className="text-[8px] font-bold text-fuchsia-500 bg-fuchsia-500/15 px-1.5 py-0.5 rounded-full">
                          +10 individual
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={`p-3 rounded-2xl ${t.cardSub} border border-violet-500/15 flex items-center justify-between mt-3 text-[10px]`}>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className={t.textMuted}>Regra Fair Sync:</span>
              </div>
              <div className="font-bold text-violet-500 text-[10px]">
                +50 coletivo / +10 ao segurar
              </div>
            </div>
          </div>

          <div className={`${t.card} rounded-3xl p-5 transition-colors`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`${t.textMain} font-bold text-sm`}>Resolução Híbrida (Caderno Físico)</h3>
              <button
                onClick={handleUploadNotebook}
                disabled={isUploading}
                className={`px-4 py-2 rounded-xl ${t.primaryGrad} flex items-center gap-2 text-white text-xs font-bold shadow-md hover:brightness-110 transition-all`}
              >
                <Camera className="w-4 h-4" />
                <span>{isUploading ? 'Enviando...' : 'Fotografar Caderno'}</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {notebooks && notebooks.length > 0 ? (
                notebooks.map((nb: any, idx: number) => (
                  <div key={nb.id || idx} className={`p-3 rounded-xl ${t.cardSub} flex gap-3 items-center border border-violet-500/10`}>
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[8px] font-bold px-1.5 py-0.5 bg-violet-500/20 text-violet-600 dark:text-violet-300 rounded uppercase">
                        {nb.badge || 'Foto de Caderno'}
                      </span>
                      <p className={`${t.textMain} text-xs font-semibold mt-1 truncate`}>{nb.title}</p>
                      <p className={`${t.textMuted} text-[9px] truncate`}>
                        Enviado por {nb.author_name || nb.student_name || 'Alex'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className={`p-3 rounded-xl ${t.cardSub} flex gap-3 items-center border border-violet-500/10`}>
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <span className="text-[8px] font-bold px-1.5 py-0.5 bg-violet-500/20 text-violet-600 dark:text-violet-300 rounded uppercase">
                        Foto de Caderno
                      </span>
                      <p className={`${t.textMain} text-xs font-semibold mt-1`}>Mapa Mental - Climas</p>
                      <p className={`${t.textMuted} text-[9px]`}>Enviado por Alex (Curador)</p>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${t.cardSub} flex gap-3 items-center border border-violet-500/10`}>
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <LinkIcon className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <span className="text-[8px] font-bold px-1.5 py-0.5 bg-blue-500/20 text-blue-600 dark:text-blue-300 rounded uppercase">
                        Link Recomendado
                      </span>
                      <p className={`${t.textMain} text-xs font-semibold mt-1`}>Vídeo: El Niño (Youtube)</p>
                      <p className={`${t.textMuted} text-[9px]`}>Enviado por Bia (Revisora)</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className={`${t.card} rounded-3xl p-6 text-center space-y-3 transition-colors`}>
          <div className="w-12 h-12 rounded-full bg-amber-500/15 mx-auto flex items-center justify-center text-amber-500">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className={`${t.textMain} font-bold text-base`}>Hub da Escola (Global)</h3>
          <p className={`${t.textMuted} text-xs max-w-xs mx-auto leading-relaxed`}>
            Espaço assíncrono para compartilhamento de curadorias entre séries. Materiais validados pela coordenação estarão disponíveis aqui.
          </p>
        </div>
      )}
    </div>
  );
}
