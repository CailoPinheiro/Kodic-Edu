'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ThemeTokens {
  appBg: string;
  deviceFrame: string;
  mainGrad: string;
  header: string;
  textMain: string;
  textMuted: string;
  card: string;
  cardSub: string;
  tabBar: string;
  tabIconUnselected: string;
  primaryGrad: string;
}

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: ThemeTokens;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem('kodic_theme');
    if (saved === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('kodic_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('kodic_theme', 'light');
      }
      return next;
    });
  };

  const theme: ThemeTokens = {
    appBg: isDarkMode ? 'bg-[#0B041C]' : 'bg-violet-50',
    deviceFrame: isDarkMode ? 'bg-[#130B2E] border-gray-900' : 'bg-white border-slate-300',
    mainGrad: isDarkMode ? 'from-[#130B2E] to-[#0a051c]' : 'from-white to-violet-50',
    header: isDarkMode ? 'bg-[#130b2e]/90 border-violet-900/50' : 'bg-white/90 border-violet-100 shadow-sm',
    textMain: isDarkMode ? 'text-white' : 'text-slate-900',
    textMuted: isDarkMode ? 'text-violet-300' : 'text-slate-500',
    card: isDarkMode ? 'bg-[#1C1242] border-violet-800/50' : 'bg-white border-violet-100 shadow-md',
    cardSub: isDarkMode ? 'bg-[#130B2E] border-violet-900/50' : 'bg-slate-50 border-violet-50',
    tabBar: isDarkMode ? 'bg-[#130B2E]/95 border-violet-900/50' : 'bg-white/95 border-violet-100 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.05)]',
    tabIconUnselected: isDarkMode ? 'text-violet-500' : 'text-slate-400',
    primaryGrad: 'bg-gradient-to-r from-violet-600 to-fuchsia-500'
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
