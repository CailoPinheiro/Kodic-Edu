'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Home, Users, Gamepad2, Heart, Sparkles, User, GraduationCap, Zap, ChevronUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Header } from '@/components/Header';
import { Drawer } from '@/components/Drawer';
import { AuthView } from '@/components/AuthView';
import { StudentHome } from '@/components/student/StudentHome';
import { StudentGroup } from '@/components/student/StudentGroup';
import { StudentMissions } from '@/components/student/StudentMissions';
import { StudentImpact } from '@/components/student/StudentImpact';
import { TeacherDashboard } from '@/components/teacher/TeacherDashboard';

export default function Page() {
  const { user, isAuthenticated, isTeacher, quickLogin } = useAuth();
  const { isDarkMode, theme: t } = useTheme();

  const [studentTab, setStudentTab] = useState<'inicio' | 'grupo' | 'missoes' | 'impacto'>('inicio');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [impactTriggered, setImpactTriggered] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [currentClass, setCurrentClass] = useState<any>(null);
  const [sharedGroup, setSharedGroup] = useState<any>(null);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [notebooks, setNotebooks] = useState<any[]>([]);
  const [impactNotifications, setImpactNotifications] = useState<any[]>([]);

  const [toasts, setToasts] = useState<Array<{ id: number; message: string }>>([]);

  const showToast = (message: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const loadAppData = async () => {
    if (!isAuthenticated) return;
    try {
      const token = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
      const headers = { Authorization: `Bearer ${token}` };

      const [classRes, quizzesRes, annRes, impactRes] = await Promise.all([
        fetch('/api/classes/current', { headers }).then((r) => r.json()).catch(() => ({ class: null })),
        fetch('/api/quizzes', { headers }).then((r) => r.json()).catch(() => ({ quizzes: [] })),
        fetch('/api/content/announcements', { headers }).then((r) => r.json()).catch(() => ({ announcements: [] })),
        fetch('/api/content/impact', { headers }).then((r) => r.json()).catch(() => ({ notifications: [] }))
      ]);

      setCurrentClass(classRes.class);
      setQuizzes(quizzesRes.quizzes || []);
      setAnnouncements(annRes.announcements || []);
      setImpactNotifications(impactRes.notifications || []);

      if (!isTeacher) {
        const [groupRes, notesRes] = await Promise.all([
          fetch('/api/groups/shared', { headers }).then((r) => r.json()).catch(() => ({ group: null })),
          fetch('/api/content/notebooks', { headers }).then((r) => r.json()).catch(() => ({ notebooks: [] }))
        ]);
        setSharedGroup(groupRes.group);
        setNotebooks(notesRes.notebooks || []);
      }
    } catch {}
  };

  useEffect(() => {
    loadAppData();
  }, [isAuthenticated, isTeacher]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    setShowScrollTop(target.scrollTop > 70);
  };

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen ${t.appBg} flex flex-col items-center justify-center p-2 sm:p-4 font-sans transition-colors duration-500`}>
      {isAuthenticated && (
        <div className="w-full max-w-[400px] flex items-center justify-between mb-3 px-2">
          <div className="flex items-center gap-1.5 text-xs font-black">
            <Zap className="w-4 h-4 text-fuchsia-500" />
            <span className={t.textMain}>
              {isTeacher ? 'Painel do Docente' : 'Visão do Aluno'}
            </span>
          </div>

          <button
            onClick={() => quickLogin(isTeacher ? 'student' : 'teacher')}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl border border-violet-500/25 ${t.cardSub} ${t.textMain} flex items-center gap-1.5 shadow-sm hover:brightness-105 transition-all`}
          >
            {isTeacher ? (
              <>
                <User className="w-3.5 h-3.5 text-fuchsia-500" />
                <span>Alternar para Aluno</span>
              </>
            ) : (
              <>
                <GraduationCap className="w-3.5 h-3.5 text-violet-500" />
                <span>Alternar para Professor</span>
              </>
            )}
          </button>
        </div>
      )}

      <div className={`w-full max-w-[400px] h-[840px] max-h-[92vh] ${t.deviceFrame} rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col border-[8px] transition-colors duration-500`}>
        <div className={`absolute inset-0 bg-gradient-to-b ${t.mainGrad} opacity-40 pointer-events-none`} />

        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col justify-center overflow-y-auto">
            <AuthView />
          </div>
        ) : (
          <>
            <Drawer
              isOpen={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
            />

            <Header
              onOpenDrawer={() => setIsDrawerOpen(true)}
              onSelectTab={(tab) => setStudentTab(tab as any)}
            />

            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto relative z-10 custom-scrollbar"
            >
              {isTeacher ? (
                <TeacherDashboard
                  currentClass={currentClass}
                  showToast={showToast}
                  onDataChange={loadAppData}
                />
              ) : (
                <>
                  {studentTab === 'inicio' && (
                    <StudentHome
                      currentClass={currentClass}
                      quizzes={quizzes}
                      announcements={announcements}
                      onDataChange={loadAppData}
                      showToast={showToast}
                      onAnswerCorrect={() => setImpactTriggered(true)}
                    />
                  )}
                  {studentTab === 'grupo' && (
                    <StudentGroup
                      sharedGroup={sharedGroup}
                      notebooks={notebooks}
                      onDataChange={loadAppData}
                      showToast={showToast}
                    />
                  )}
                  {studentTab === 'missoes' && (
                    <StudentMissions
                      quizzes={quizzes}
                      onGoToHome={() => setStudentTab('inicio')}
                      showToast={showToast}
                    />
                  )}
                  {studentTab === 'impacto' && (
                    <StudentImpact
                      impactNotifications={impactNotifications}
                      impactTriggered={impactTriggered}
                    />
                  )}
                </>
              )}
            </div>

            {showScrollTop && (
              <button
                onClick={scrollToTop}
                title="Rolar para o topo"
                aria-label="Rolar para o topo"
                className={`absolute ${
                  isTeacher ? 'bottom-4' : 'bottom-[76px]'
                } right-4 z-30 w-9 h-9 rounded-full bg-[#05020F]/95 border-2 border-violet-500/80 shadow-[0_0_14px_rgba(139,92,246,0.6)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group animate-in fade-in zoom-in duration-200`}
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-[0_0_8px_rgba(217,70,239,0.8)] group-hover:from-violet-500 group-hover:to-fuchsia-400">
                  <ChevronUp className="w-3.5 h-3.5 text-white stroke-[3]" />
                </div>
              </button>
            )}

            {!isTeacher && (
              <div className={`w-full ${t.tabBar} backdrop-blur-md pb-6 pt-3 px-6 z-20 transition-colors duration-500 border-t`}>
                <div className="flex justify-between items-center">
                  {[
                    { id: 'inicio', label: 'Início', icon: Home },
                    { id: 'grupo', label: 'Grupo', icon: Users },
                    { id: 'missoes', label: 'Missões', icon: Gamepad2 },
                    { id: 'impacto', label: 'Impacto', icon: Heart }
                  ].map((tab) => {
                    const isActive = studentTab === tab.id;
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setStudentTab(tab.id as any)}
                        className={`flex flex-col items-center gap-1 transition-all ${
                          isActive ? 'text-fuchsia-500 scale-110 font-bold' : t.tabIconUnselected
                        }`}
                      >
                        <div className="relative">
                          <Icon
                            className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : ''} ${
                              tab.id === 'impacto' && isActive ? 'fill-fuchsia-500/20' : ''
                            }`}
                          />
                          {tab.id === 'impacto' && impactTriggered && !isActive && (
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-fuchsia-500 rounded-full border-2 border-white dark:border-[#0a051c] animate-ping" />
                          )}
                          {tab.id === 'impacto' && impactTriggered && (
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-fuchsia-500 rounded-full border-2 border-white dark:border-[#0a051c]" />
                          )}
                        </div>
                        <span className="text-[10px] font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center gap-2 bg-[#1C1242] border border-fuchsia-500/50 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-2xl pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            <Sparkles className="w-4 h-4 text-fuchsia-400 flex-shrink-0" />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
