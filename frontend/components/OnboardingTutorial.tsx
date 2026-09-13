'use client';

import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Gamepad2,
  Heart,
  Sparkles,
  BrainCircuit,
  BarChart3,
  Shield,
  ChevronRight,
  Check,
  type LucideIcon
} from 'lucide-react';
import { useTheme } from '@/frontend/context/ThemeContext';

interface OnboardingTutorialProps {
  isTeacher: boolean;
  onClose: () => void;
}

interface Slide {
  icon: LucideIcon;
  title: string;
  description: string;
}

const STUDENT_SLIDES: Slide[] = [
  {
    icon: Sparkles,
    title: 'Bem-vindo ao Kodic Edu',
    description: 'O celular deixa de ser motivo de distração e vira ferramenta de colaboração. Vamos te mostrar como funciona em poucos passos.'
  },
  {
    icon: Smartphone,
    title: 'Modo Compartilhado',
    description: 'Você faz parte de uma Mesa: até 4 alunos dividem o mesmo celular. Quando o grupo acerta um quiz, todo mundo pontua igual, ninguém fica de fora.'
  },
  {
    icon: Gamepad2,
    title: 'Missões e Hub da Turma',
    description: 'Na aba Missões você acompanha trilhas por matéria e responde quizzes. O Hub reúne o que a turma toda publicou: cadernos, mapas mentais e links.'
  },
  {
    icon: Heart,
    title: 'Impacto Silencioso',
    description: 'Sem curtidas públicas nem ranking de vaidade. Você recebe reconhecimento privado, só pra você, pela ajuda real que oferece aos colegas.'
  }
];

const TEACHER_SLIDES: Slide[] = [
  {
    icon: Sparkles,
    title: 'Bem-vinda ao Kodic Edu',
    description: 'Seu painel reúne o que você precisa pra manter a turma engajada sem sobrecarga: geração de quiz, avisos, moderação e acompanhamento.'
  },
  {
    icon: BrainCircuit,
    title: 'Assistente BNCC',
    description: 'Escolha uma habilidade da BNCC e gere um quiz estruturado em segundos, pronto pra revisar e publicar pra turma.'
  },
  {
    icon: BarChart3,
    title: 'Heatmap e Moderação',
    description: 'Acompanhe o domínio de cada competência da turma no Heatmap, e revise materiais sinalizados na Fila de Moderação antes de aprovar.'
  },
  {
    icon: Shield,
    title: 'Onboarding Progressivo',
    description: 'Ative recursos aos poucos: comece só com quizzes, depois Líderes de Turma e, por fim, a Sala de Aula Invertida, no seu ritmo.'
  }
];

export function OnboardingTutorial({ isTeacher, onClose }: OnboardingTutorialProps) {
  const { theme: t } = useTheme();
  const slides = isTeacher ? TEACHER_SLIDES : STUDENT_SLIDES;
  const [index, setIndex] = useState<number>(0);

  const slide = slides[index];
  const Icon = slide.icon;
  const isLast = index === slides.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-5 animate-in fade-in">
      <div className={`w-full max-w-sm rounded-3xl p-6 ${t.card} border border-violet-500/20 shadow-2xl relative animate-in zoom-in-95 duration-200`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Fechar tutorial"
        >
          <X className="w-4 h-4" />
        </button>

        <div className={`w-14 h-14 rounded-2xl ${t.primaryGrad} flex items-center justify-center mb-4 shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>

        <h2 className={`${t.textMain} font-black text-lg mb-2`}>{slide.title}</h2>
        <p className={`${t.textMuted} text-xs leading-relaxed mb-6`}>{slide.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-5 bg-fuchsia-500' : 'w-1.5 bg-violet-500/20'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            {!isLast && (
              <button
                onClick={onClose}
                className={`${t.textMuted} text-xs font-bold hover:text-fuchsia-500 transition-colors`}
              >
                Pular
              </button>
            )}
            <button
              onClick={handleNext}
              className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold text-white ${t.primaryGrad} shadow-md hover:brightness-110 active:scale-95 transition-all`}
            >
              <span>{isLast ? 'Começar' : 'Próximo'}</span>
              {isLast ? <Check className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
