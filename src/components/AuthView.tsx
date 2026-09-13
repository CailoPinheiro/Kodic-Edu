'use client';

import React, { useState } from 'react';
import { Zap, User, GraduationCap, ChevronRight, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export function AuthView() {
  const { login, register, quickLogin } = useAuth();
  const { isDarkMode, theme: t } = useTheme();

  const [loginType, setLoginType] = useState<'student' | 'teacher'>('student');
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [grade, setGrade] = useState<string>('1º Ano A — Ensino Médio');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      if (isRegisterMode) {
        await register({
          name,
          email,
          password,
          role: loginType,
          grade: loginType === 'student' ? grade : 'Ensino Médio e Fundamental II',
          intelligenceRole: 'Curador'
        });
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro na autenticação.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-6 relative z-10 animate-in fade-in duration-500 w-full max-w-sm mx-auto">
      <div className="text-center mb-8">
        <div className={`w-20 h-20 mx-auto rounded-full ${t.primaryGrad} flex items-center justify-center shadow-xl shadow-violet-500/20 mb-4`}>
          <Zap className="w-10 h-10 text-white" />
        </div>
        <h1 className={`${t.textMain} font-black text-4xl tracking-tight mb-2`}>
          Kodic<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">Edu</span>
        </h1>
        <p className={`${t.textMuted} text-xs max-w-[250px] mx-auto`}>
          O Celular como Ferramenta de Engajamento Coletivo & Bem-Estar Escolar
        </p>
      </div>

      <div className={`flex p-1 rounded-2xl ${t.cardSub} mb-6 border border-violet-500/10`}>
        <button
          type="button"
          onClick={() => setLoginType('student')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
            loginType === 'student' ? `${t.card} shadow-sm ${t.textMain}` : t.textMuted
          }`}
        >
          Sou Aluno
        </button>
        <button
          type="button"
          onClick={() => setLoginType('teacher')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
            loginType === 'teacher' ? `${t.card} shadow-sm ${t.textMain}` : t.textMuted
          }`}
        >
          Sou Professor
        </button>
      </div>

      {errorMessage && (
        <div className="p-3 mb-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs text-center font-semibold">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5 mb-6">
        {isRegisterMode && (
          <input
            type="text"
            required
            placeholder="Nome Completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-4 rounded-2xl ${t.card} ${t.textMain} text-sm focus:outline-none border focus:border-fuchsia-500 transition-colors`}
          />
        )}

        <input
          type="email"
          required
          placeholder="E-mail Institucional ou Escolar"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full p-4 rounded-2xl ${t.card} ${t.textMain} text-sm focus:outline-none border focus:border-fuchsia-500 transition-colors`}
        />

        <input
          type="password"
          required
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full p-4 rounded-2xl ${t.card} ${t.textMain} text-sm focus:outline-none border focus:border-fuchsia-500 transition-colors`}
        />


        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 rounded-2xl ${t.primaryGrad} text-white font-bold text-sm shadow-lg hover:brightness-110 active:scale-[0.99] transition-all`}
        >
          {isSubmitting ? 'Conectando...' : isRegisterMode ? 'Criar Conta' : 'Entrar no Kodic Edu'}
        </button>

        <p
          onClick={() => {
            setIsRegisterMode(!isRegisterMode);
            setErrorMessage('');
          }}
          className="text-center text-xs text-violet-500 font-semibold cursor-pointer hover:underline pt-1"
        >
          {isRegisterMode ? 'Já tem uma conta? Faça login' : 'Ainda não tem conta? Cadastre-se'}
        </p>
      </form>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className={`w-full border-t ${isDarkMode ? 'border-violet-800' : 'border-violet-200'}`}></div>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
          <span className={`${isDarkMode ? 'bg-[#0B041C]' : 'bg-violet-50'} px-2 ${t.textMuted}`}>
            Acesso Rápido de Demonstração (1 clique)
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => quickLogin('student')}
          className={`w-full py-3 px-4 rounded-xl border-2 ${
            isDarkMode ? 'border-violet-700 bg-[#1C1242]/50' : 'border-violet-200 bg-white'
          } flex items-center justify-between hover:border-violet-500 transition-all text-left`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-violet-600 dark:text-violet-300" />
            </div>
            <div>
              <p className={`${t.textMain} text-xs font-bold`}>Entrar como Aluno</p>
              <p className={`${t.textMuted} text-[10px]`}>Alex Silva — Líder / Curador</p>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 ${t.textMuted}`} />
        </button>

        <button
          type="button"
          onClick={() => quickLogin('teacher')}
          className={`w-full py-3 px-4 rounded-xl border-2 ${
            isDarkMode ? 'border-fuchsia-700 bg-[#1C1242]/50' : 'border-fuchsia-200 bg-white'
          } flex items-center justify-between hover:border-fuchsia-500 transition-all text-left`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-4 h-4 text-fuchsia-600 dark:text-fuchsia-300" />
            </div>
            <div>
              <p className={`${t.textMain} text-xs font-bold`}>Entrar como Professora</p>
              <p className={`${t.textMuted} text-[10px]`}>Profª. Cláudia Mendes</p>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 ${t.textMuted}`} />
        </button>
      </div>

      <p className={`text-center text-[9px] mt-8 flex items-center justify-center gap-1 ${t.textMuted}`}>
        <Shield className="w-3 h-3 text-violet-500 flex-shrink-0" />
        <span>Privacy by Design: dados escolares protegidos pela LGPD</span>
      </p>
    </div>
  );
}
