import React, { useState, useEffect } from 'react';
import { Home, Users, Gamepad2, Heart, Sparkles, User, GraduationCap } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';

import { Header } from './components/common/Header';
import { Drawer } from './components/common/Drawer';
import { AuthModal } from './components/auth/AuthModal';

import { StudentHomeTab } from './components/student/StudentHomeTab';
import { StudentGroupTab } from './components/student/StudentGroupTab';
import { StudentMissionsTab } from './components/student/StudentMissionsTab';
import { StudentImpactTab } from './components/student/StudentImpactTab';
import { StudentFocusModal } from './components/student/StudentFocusModal';

import { TeacherDashboard } from './components/teacher/TeacherDashboard';

export default function App() {
  const { user, isAuthenticated, isTeacher, quickLogin } = useAuth();

  const [activeTab, setActiveTab] = useState('inicio');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFocusOpen, setIsFocusOpen] = useState(false);

  const [currentClass, setCurrentClass] = useState(null);
  const [sharedGroup, setSharedGroup] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [notebooks, setNotebooks] = useState([]);
  const [impactNotifications, setImpactNotifications] = useState([]);

  const [toasts, setToasts] = useState([]);

  const showToast = (message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const loadAppData = async () => {
    if (!isAuthenticated) return;
    try {
      const [classRes, quizzesRes, annRes, impactRes] = await Promise.all([
        api.classes.getCurrent().catch(() => ({ class: null })),
        api.quizzes.getAll().catch(() => ({ quizzes: [] })),
        api.content.getAnnouncements().catch(() => ({ announcements: [] })),
        api.content.getImpactNotifications().catch(() => ({ notifications: [] }))
      ]);

      setCurrentClass(classRes.class);
      setQuizzes(quizzesRes.quizzes || []);
      setAnnouncements(annRes.announcements || []);
      setImpactNotifications(impactRes.notifications || []);

      if (!isTeacher) {
        const [groupRes, notesRes] = await Promise.all([
          api.groups.getShared().catch(() => ({ group: null })),
          api.content.getNotebooks().catch(() => ({ notebooks: [] }))
        ]);
        setSharedGroup(groupRes.group);
        setNotebooks(notesRes.notebooks || []);
      }
    } catch {}
  };

  useEffect(() => {
    loadAppData();
  }, [isAuthenticated, isTeacher]);

  if (!isAuthenticated) {
    return (
      <>
        <header className="control-bar">
          <div className="brand-logo">
            <Sparkles size={22} style={{ color: 'var(--kodic-fuchsia)' }} />
            <span>Kodic<span style={{ color: 'var(--kodic-fuchsia)' }}>Edu</span></span>
          </div>
        </header>

        <AuthModal />
      </>
    );
  }

  return (
    <>
      <header className="control-bar">
        <div className="brand-logo">
          <Sparkles size={22} style={{ color: 'var(--kodic-fuchsia)' }} />
          <span>Kodic<span style={{ color: 'var(--kodic-fuchsia)' }}>Edu</span></span>
          <span className="brand-badge">
            {isTeacher ? 'Painel Docente' : 'Visão Aluno'}
          </span>
        </div>

        <div className="top-actions">
          <button
            className="btn-secondary"
            onClick={() => quickLogin(isTeacher ? 'student' : 'teacher')}
            style={{ fontSize: '0.74rem', borderColor: 'var(--kodic-purple)' }}
          >
            {isTeacher ? (
              <>
                <User size={14} style={{ color: 'var(--kodic-fuchsia)' }} />
                <span>Simular Visão do Aluno</span>
              </>
            ) : (
              <>
                <GraduationCap size={14} style={{ color: 'var(--kodic-purple)' }} />
                <span>Alternar para Painel do Professor</span>
              </>
            )}
          </button>
        </div>
      </header>

      <main className="device-wrapper">
        <div className="phone-container">
          <Header
            onOpenDrawer={() => setIsDrawerOpen(true)}
            onSelectTab={setActiveTab}
          />

          <Drawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            onOpenFocus={() => setIsFocusOpen(true)}
          />

          <div className="screen-content">
            {isTeacher ? (
              <TeacherDashboard
                currentClass={currentClass}
                showToast={showToast}
                onDataChange={loadAppData}
              />
            ) : (
              <>
                {activeTab === 'inicio' && (
                  <StudentHomeTab
                    currentClass={currentClass}
                    quizzes={quizzes}
                    announcements={announcements}
                    onDataChange={loadAppData}
                    showToast={showToast}
                  />
                )}
                {activeTab === 'grupo' && (
                  <StudentGroupTab
                    sharedGroup={sharedGroup}
                    notebooks={notebooks}
                    onDataChange={loadAppData}
                    showToast={showToast}
                  />
                )}
                {activeTab === 'missoes' && (
                  <StudentMissionsTab
                    currentClass={currentClass}
                    showToast={showToast}
                  />
                )}
                {activeTab === 'impacto' && (
                  <StudentImpactTab
                    impactNotifications={impactNotifications}
                  />
                )}
              </>
            )}
          </div>

          {!isTeacher && (
            <nav className="app-nav">
              <button
                className={`nav-item ${activeTab === 'inicio' ? 'active' : ''}`}
                onClick={() => setActiveTab('inicio')}
              >
                <Home size={18} />
                <span>Início</span>
              </button>
              <button
                className={`nav-item ${activeTab === 'grupo' ? 'active' : ''}`}
                onClick={() => setActiveTab('grupo')}
              >
                <Users size={18} />
                <span>Grupo</span>
              </button>
              <button
                className={`nav-item ${activeTab === 'missoes' ? 'active' : ''}`}
                onClick={() => setActiveTab('missoes')}
              >
                <Gamepad2 size={18} />
                <span>Missões</span>
              </button>
              <button
                className={`nav-item ${activeTab === 'impacto' ? 'active' : ''}`}
                onClick={() => setActiveTab('impacto')}
              >
                <Heart size={18} />
                <span>Impacto</span>
              </button>
            </nav>
          )}
        </div>
      </main>

      <StudentFocusModal
        isOpen={isFocusOpen}
        onClose={() => setIsFocusOpen(false)}
        showToast={showToast}
      />

      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <Sparkles size={16} style={{ color: 'var(--kodic-fuchsia)' }} />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </>
  );
}
