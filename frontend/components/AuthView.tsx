'use client';

import React, { useState, useEffect } from 'react';
import { Zap, User, GraduationCap, ChevronRight, Shield, Search, Check } from 'lucide-react';
import { useAuth } from '@/frontend/context/AuthContext';
import { useTheme } from '@/frontend/context/ThemeContext';

interface SchoolOption {
  id: number;
  name: string;
  city?: string;
}

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

  const [schoolQuery, setSchoolQuery] = useState<string>('');
  const [schoolResults, setSchoolResults] = useState<SchoolOption[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<SchoolOption | null>(null);
  const [showSchoolResults, setShowSchoolResults] = useState<boolean>(false);

  const isTeacherRegister = isRegisterMode && loginType === 'teacher';

  useEffect(() => {
    if (!isTeacherRegister || selectedSchool) return;
    const timer = setTimeout(() => {
      fetch(`/api/schools?q=${encodeURIComponent(schoolQuery)}`)
        .then((res) => res.json())
        .then((data) => setSchoolResults(data.schools || []))
        .catch(() => setSchoolResults([]));
    }, 300);
    return () => clearTimeout(timer);
  }, [schoolQuery, isTeacherRegister, selectedSchool]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (isTeacherRegister && !selectedSchool) {
      setErrorMessage('Selecione a escola na lista de busca.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isRegisterMode) {
        await register({
          name,
          email,
          password,
          role: loginType,
          grade: loginType === 'student' ? grade : 'Ensino Médio e Fundamental II',
          intelligenceRole: 'Curador',
          schoolId: loginType === 'teacher' ? selectedSchool?.id : undefined
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
            className={`w-full p-4 rounded-2xl ${t.card} ${t.textMain} placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none border focus:border-fuchsia-500 transition-colors`}
          />
        )}

        {isTeacherRegister && (
          <div className="relative">
            {selectedSchool ? (
              <div className={`w-full p-4 rounded-2xl ${t.card} border border-fuchsia-500/40 flex items-center justify-between`}>
                <div className="flex items-center gap-2 min-w-0">
                  <Check className="w-4 h-4 text-fuchsia-500 flex-shrink-0" />
                  <span className={`${t.textMain} text-sm font-semibold truncate`}>{selectedSchool.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSchool(null);
                    setSchoolQuery('');
                  }}
                  className="text-[10px] font-bold text-violet-500 hover:underline flex-shrink-0 ml-2"
                >
                  Trocar
                </button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <Search className={`w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 ${t.textMuted}`} />
                  <input
                    type="text"
                    required
                    placeholder="Buscar sua escola pelo nome"
                    value={schoolQuery}
                    onChange={(e) => setSchoolQuery(e.target.value)}
                    onFocus={() => setShowSchoolResults(true)}
                    className={`w-full p-4 pl-11 rounded-2xl ${t.card} ${t.textMain} placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none border focus:border-fuchsia-500 transition-colors`}
                  />
                </div>
                {showSchoolResults && schoolResults.length > 0 && (
                  <div className={`absolute z-20 mt-1 w-full rounded-2xl ${t.card} border border-violet-500/20 shadow-lg overflow-hidden`}>
                    {schoolResults.map((school) => (
                      <button
                        key={school.id}
                        type="button"
                        onClick={() => {
                          setSelectedSchool(school);
                          setShowSchoolResults(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm ${t.textMain} hover:bg-violet-500/10 transition-colors`}
                      >
                        {school.name}
                        {school.city && <span className={`${t.textMuted} text-xs`}> — {school.city}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <input
          type="email"
          required
          placeholder="E-mail Institucional ou Escolar"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full p-4 rounded-2xl ${t.card} ${t.textMain} placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none border focus:border-fuchsia-500 transition-colors`}
        />

        <input
          type="password"
          required
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full p-4 rounded-2xl ${t.card} ${t.textMain} placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none border focus:border-fuchsia-500 transition-colors`}
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
