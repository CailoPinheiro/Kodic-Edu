'use client';

import React from 'react';
import { Menu, Zap, Sun, Moon, Bell, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

interface HeaderProps {
  onOpenDrawer: () => void;
  onSelectTab: (tab: string) => void;
}

export function Header({ onOpenDrawer, onSelectTab }: HeaderProps) {
  const { logout, isTeacher } = useAuth();
  const { isDarkMode, toggleTheme, theme: t } = useTheme();

  return (
    <div className={`pt-4 pb-3 px-5 ${t.header} relative z-10 flex justify-between items-center backdrop-blur-md border-b transition-colors`}>
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenDrawer}
          className={`p-1.5 -ml-1.5 rounded-xl ${t.textMain} hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}
          title="Menu Lateral"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <div className={`w-6 h-6 rounded-md ${t.primaryGrad} flex items-center justify-center shadow-sm`}>
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <h1 className={`${t.textMain} font-black text-lg tracking-tight`}>
              Kodic<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">Edu</span>
            </h1>
          </div>
          {isTeacher && (
            <span className="text-[9px] font-bold tracking-widest uppercase text-violet-500 mt-0.5">
              Painel Docente
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className={`w-9 h-9 rounded-full ${t.cardSub} flex items-center justify-center transition-colors border border-violet-500/15`}
          title="Alternar Modo Claro/Escuro"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-violet-600" />
          )}
        </button>

        {!isTeacher && (
          <button
            onClick={() => onSelectTab('impacto')}
            className={`w-9 h-9 rounded-full ${t.cardSub} flex items-center justify-center relative border border-violet-500/15`}
            title="Impacto Silencioso"
          >
            <Bell className={`w-4 h-4 ${t.textMain}`} />
            <div className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full border-2 border-white dark:border-[#130b2e]"></div>
          </button>
        )}

        <button
          onClick={logout}
          className={`w-9 h-9 rounded-full ${t.cardSub} flex items-center justify-center text-red-500 border border-violet-500/15 hover:bg-red-500/10 transition-colors`}
          title="Sair da Conta"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
