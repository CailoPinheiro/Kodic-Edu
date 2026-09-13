'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Home, Users, Gamepad2, Heart, ChevronUp, Sparkles, X } from 'lucide-react';
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
import { ResponsiveDeviceBar } from '@/components/ResponsiveDeviceBar';

export default function Page() {
  const { user, isAuthenticated, isTeacher } = useAuth();
  const { isDarkMode, theme: t } = useTheme();

  const [studentTab, setStudentTab] = useState<'inicio' | 'grupo' | 'missoes' | 'impacto'>('inicio');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [impactTriggered, setImpactTriggered] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [pointsNotification, setPointsNotification] = useState<{ points: number; isHolder: boolean } | null>(null);
  const pointsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [currentClass, setCurrentClass] = useState<any>(null);
  const [sharedGroup, setSharedGroup] = useState<any>(null);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [quizStats, setQuizStats] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [notebooks, setNotebooks] = useState<any[]>([]);
  const [impactNotifications, setImpactNotifications] = useState<any[]>([]);

  const loadAppData = async () => {
    try {
      const token = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      const [classRes, groupRes, quizzesRes, annRes, noteRes, impactRes] = await Promise.all([
        fetch('/api/classes/current', { headers }).then((r) => r.json()).catch(() => ({})),
        fetch('/api/groups/shared', { headers }).then((r) => r.json()).catch(() => ({})),
        fetch('/api/quizzes', { headers }).then((r) => r.json()).catch(() => ({})),
        fetch('/api/content/announcements', { headers }).then((r) => r.json()).catch(() => ({})),
        fetch('/api/content/notebooks', { headers }).then((r) => r.json()).catch(() => ({})),
        fetch('/api/content/impact', { headers }).then((r) => r.json()).catch(() => ({}))
      ]);

      if (classRes?.class) setCurrentClass(classRes.class);
      setSharedGroup(groupRes?.group || null);
      if (quizzesRes?.quizzes) {
        setQuizzes(quizzesRes.quizzes);
        setQuizStats(quizzesRes.stats || null);
      }
      if (annRes?.announcements) setAnnouncements(annRes.announcements);
      if (noteRes?.notebooks) setNotebooks(noteRes.notebooks);
      if (impactRes?.notifications) setImpactNotifications(impactRes.notifications);
    } catch {}
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAppData();
    }
  }, [isAuthenticated, user?.id, studentTab]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      loadAppData();
    }, 4000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user?.id]);

  const [deviceWidth, setDeviceWidth] = useState<number>(400);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setShowScrollTop(scrollTop > 200);
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleEarnPoints = (info?: { points: number; isHolder: boolean }) => {
    if (pointsTimerRef.current) clearTimeout(pointsTimerRef.current);
    setPointsNotification({
      points: info?.points || 50,
      isHolder: Boolean(info?.isHolder)
    });
    setImpactTriggered(true);
    pointsTimerRef.current = setTimeout(() => {
      setPointsNotification(null);
    }, 4000);
  };

  return (
    <div className={`min-h-screen ${t.appBg} flex flex-col items-center justify-center p-2 sm:p-4 font-sans transition-colors duration-500 overflow-x-hidden`}>
      <ResponsiveDeviceBar
        deviceWidth={deviceWidth}
        setDeviceWidth={setDeviceWidth}
        onReset={() => setDeviceWidth(400)}
      />

      <div className="relative flex items-center justify-center max-w-full">
        <div
          style={{ width: `${deviceWidth}px` }}
          className={`max-w-[96vw] h-[840px] max-h-[92vh] ${t.deviceFrame} rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col border-[8px] transition-all duration-300 ease-out`}
        >
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

              {pointsNotification && (
                <div className="absolute top-16 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="pointer-events-auto max-w-[280px] w-full bg-slate-900/95 dark:bg-[#190E38]/95 border border-emerald-500/50 shadow-[0_8px_25px_rgba(16,185,129,0.25)] rounded-2xl p-2.5 flex items-center justify-between gap-2 backdrop-blur-md">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-emerald-400 leading-tight">
                          Pontos recebidos: +{pointsNotification.points}
                        </p>
                        <p className="text-[10px] text-slate-300 dark:text-violet-300 font-medium leading-tight mt-0.5">
                          {pointsNotification.isHolder
                            ? '(+10 bônus por estar na sua vez)'
                            : '(se tiver na sua vez, ganha +10)'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setPointsNotification(null)}
                      className="text-slate-400 hover:text-white p-1 shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto relative z-10 custom-scrollbar"
              >
                {isTeacher ? (
                  <TeacherDashboard
                    currentClass={currentClass}
                    onDataChange={loadAppData}
                  />
                ) : (
                  <>
                    {studentTab === 'inicio' && (
                      <StudentHome
                        currentClass={currentClass}
                        quizzes={quizzes}
                        quizStats={quizStats}
                        sharedGroup={sharedGroup}
                        announcements={announcements}
                        onDataChange={loadAppData}
                        onAnswerCorrect={handleEarnPoints}
                      />
                    )}
                    {studentTab === 'grupo' && (
                      <StudentGroup
                        sharedGroup={sharedGroup}
                        quizzes={quizzes}
                        quizStats={quizStats}
                        notebooks={notebooks}
                        onDataChange={loadAppData}
                        onGoToQuiz={() => setStudentTab('inicio')}
                      />
                    )}
                    {studentTab === 'missoes' && (
                      <StudentMissions
                        quizzes={quizzes}
                        quizStats={quizStats}
                        sharedGroup={sharedGroup}
                        onGoToHome={() => setStudentTab('inicio')}
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
      </div>
    </div>
  );
}
