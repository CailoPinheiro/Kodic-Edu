'use client';

import React, { useState } from 'react';
import { Gamepad2, BrainCircuit, Check, CheckSquare } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface StudentMissionsProps {
  quizzes?: any[];
  studentAnswers?: Record<string | number, { answered: boolean; selectedOption: number; isCorrect: boolean }>;
  onGoToHome?: () => void;
}

export function StudentMissions({
  quizzes = [],
  studentAnswers = {},
  onGoToHome
}: StudentMissionsProps) {
  const { isDarkMode, theme: t } = useTheme();
  const [missionsSubTab, setMissionsSubTab] = useState<'trilhas' | 'quizzes'>('trilhas');

  const defaultQuizzes = quizzes.length > 0 ? quizzes : [
    {
      id: 'q1',
      bncc: 'EM13CHS101',
      question: 'Qual a principal característica do modo de produção feudal?',
      options: [
        'Economia de subsistência e suserania.',
        'Produção industrial em larga escala.',
        'Comércio globalizado e rotas marítimas.',
        'Propriedade coletiva das terras urbanas.'
      ],
      correct: 0
    },
    {
      id: 'q2',
      bncc: 'EM13CHS202',
      question: 'Como as cidades inteligentes aplicam o conceito de espaço geográfico tecnificado?',
      options: [
        'Integrando dados em tempo real para otimizar serviços públicos.',
        'Substituindo todas as áreas verdes por data centers.',
        'Isolando bairros periféricos sem rede elétrica.',
        'Proibindo transporte público em zonas centrais.'
      ],
      correct: 0
    }
  ];

  const handleStartMission = (title: string) => {
    if (onGoToHome) {
      onGoToHome();
    }
  };

  return (
    <div className="p-5 space-y-5 animate-in fade-in pb-24">
      <div className="mb-2">
        <h2 className={`${t.textMain} font-bold text-xl flex items-center gap-2`}>
          <Gamepad2 className="w-5 h-5 text-fuchsia-500" />
          Trilhas de Aprendizagem (Missões)
        </h2>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-500 mt-2 inline-block uppercase">
          BNCC Integrada
        </span>
      </div>

      <div className={`flex p-1 rounded-2xl ${t.cardSub} mb-4 border border-violet-500/10`}>
        <button
          onClick={() => setMissionsSubTab('trilhas')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            missionsSubTab === 'trilhas' ? `${t.card} shadow-sm ${t.textMain}` : t.textMuted
          }`}
        >
          Trilhas (Missões)
        </button>
        <button
          onClick={() => setMissionsSubTab('quizzes')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            missionsSubTab === 'quizzes' ? `${t.card} shadow-sm ${t.textMain}` : t.textMuted
          }`}
        >
          Quizzes da Turma
        </button>
      </div>

      {missionsSubTab === 'trilhas' && (
        <div className="space-y-4">
          <div className={`${t.card} rounded-3xl p-5 relative overflow-hidden border border-violet-500/30 transition-colors`}>
            <div className="absolute top-0 right-0 p-3">
              <span className="text-[9px] font-bold px-2 py-1 rounded bg-violet-500/20 text-violet-600 dark:text-violet-300 uppercase">
                Trilha Oficial
              </span>
            </div>
            <h3 className={`${t.textMain} font-bold text-lg mt-4`}>Guerra Fria: Introdução</h3>
            <p className={`${t.textMuted} text-[10px] font-mono mb-2 font-bold`}>EM13CHS101</p>
            <p className={`${t.textMuted} text-xs mb-4`}>1 Vídeo Explicativo • 1 Leitura Guiada • 3 Quizzes</p>
            <div className="flex justify-between text-[10px] font-bold text-violet-500 mb-1">
              <span>Progresso</span>
              <span>33%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-5 overflow-hidden">
              <div className={`h-2 rounded-full ${t.primaryGrad} w-1/3`} />
            </div>
            <button
              onClick={() => handleStartMission('Guerra Fria: Introdução')}
              className={`w-full py-3 rounded-xl font-bold text-white text-sm ${t.primaryGrad} shadow-md hover:brightness-110 active:scale-[0.99] transition-all`}
            >
              Continuar Trilha
            </button>
          </div>

          <div className={`${t.card} rounded-3xl p-5 relative overflow-hidden border border-emerald-500/30 transition-colors`}>
            <div className="absolute top-0 right-0 p-3">
              <span className="text-[9px] font-bold px-2 py-1 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 uppercase">
                Sala de Aula Invertida
              </span>
            </div>
            <h3 className={`${t.textMain} font-bold text-lg mt-4`}>Documentário: Biomas Brasileiros</h3>
            <p className={`${t.textMuted} text-[10px] font-mono mb-2 font-bold`}>EM13CNT206</p>
            <p className={`${t.textMuted} text-xs mb-4`}>Assistir e anotar 3 dúvidas no caderno físico para debate em equipe.</p>
            <button
              onClick={() => handleStartMission('Documentário: Biomas Brasileiros')}
              className="w-full py-3 rounded-xl font-bold text-emerald-700 dark:text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all"
            >
              Continuar Trilha
            </button>
          </div>
        </div>
      )}

      {missionsSubTab === 'quizzes' && (
        <div className="space-y-4">
          {defaultQuizzes.map((quiz: any) => {
            const answer = studentAnswers[quiz.id];
            const isCorrectAnswer = answer?.isCorrect ?? false;
            const borderCol = answer
              ? isCorrectAnswer
                ? 'border-emerald-500'
                : 'border-red-500'
              : 'border-amber-500';

            return (
              <div key={quiz.id} className={`${t.card} rounded-3xl p-5 border-l-4 ${borderCol} transition-colors`}>
                <div className="flex justify-between items-start mb-3">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                      answer
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                        : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {answer ? 'Respondido' : 'Pendente'}
                  </span>
                  <span className="text-[10px] font-mono text-violet-500 bg-violet-500/10 px-2 py-0.5 rounded font-bold">
                    {quiz.bnccCode || quiz.bncc}
                  </span>
                </div>

                {!answer ? (
                  <>
                    <p className={`${t.textMain} text-sm font-medium mb-4 leading-relaxed`}>{quiz.question}</p>
                    <button
                      onClick={onGoToHome}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs ${t.primaryGrad} text-white shadow-md hover:brightness-110 transition-all`}
                    >
                      Ir para Resolução (Início)
                    </button>
                  </>
                ) : (
                  <>
                    <p className={`${t.textMain} text-sm font-medium mb-3 leading-relaxed`}>{quiz.question}</p>
                    <div className="space-y-2">
                      {quiz.options.map((opt: string, i: number) => {
                        let rowStyle = `${t.cardSub} ${t.textMuted}`;
                        let label = null;
                        const correctIdx = quiz.correctIndex ?? quiz.correct ?? 0;

                        if (i === correctIdx) {
                          rowStyle = 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-bold';
                          label = '✓ Correta';
                        } else if (i === answer.selectedOption && !isCorrectAnswer) {
                          rowStyle = 'bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/30 font-bold';
                          label = '✗ Sua Resposta';
                        }

                        return (
                          <div key={i} className={`p-2.5 rounded-xl text-xs flex justify-between items-center ${rowStyle}`}>
                            <span>{['A', 'B', 'C', 'D'][i]}) {opt}</span>
                            {label && <span className="text-[10px] uppercase shrink-0 ml-2 font-bold">{label}</span>}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
