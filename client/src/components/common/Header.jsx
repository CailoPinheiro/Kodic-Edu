import React from 'react';
import { Menu, Sun, Moon, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export function Header({ onOpenDrawer, onSelectTab }) {
  const { logout, isTeacher } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="app-header">
      <div className="header-brand">
        <button className="icon-btn" onClick={onOpenDrawer} title="Menu Lateral">
          <Menu size={20} />
        </button>
        <div className="brand-name">
          Kodic<span>Edu</span>
        </div>
        {isTeacher && <span className="pill-tag pill-purple">Painel Docente</span>}
      </div>

      <div className="header-actions">
        <button className="icon-btn" onClick={toggleTheme} title="Alternar Modo Claro/Escuro">
          {isDarkMode ? (
            <Sun size={18} style={{ color: 'var(--kodic-amber)' }} />
          ) : (
            <Moon size={18} style={{ color: 'var(--kodic-purple)' }} />
          )}
        </button>

        {!isTeacher && (
          <button className="icon-btn" onClick={() => onSelectTab('impacto')} title="Impacto Silencioso">
            <Bell size={18} />
            <div className="notification-ping" />
            <div className="notification-dot" />
          </button>
        )}

        <button className="icon-btn" onClick={logout} title="Sair da Conta">
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}
