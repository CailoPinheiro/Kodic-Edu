'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserBadge {
  id: string;
  title: string;
  desc?: string;
  icon?: string;
  color?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'teacher' | 'student';
  grade?: string;
  intelligence_role?: 'Curador' | 'Revisor' | 'Comunicador';
  is_leader?: number | boolean;
  points?: number;
  avatar_url?: string;
  badges?: UserBadge[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  isLeader: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (userData: any) => Promise<User>;
  quickLogin: (roleOrEmail: 'teacher' | 'student' | string) => Promise<User>;
  logout: () => void;
  updateIntelligenceRole: (newRole: 'Curador' | 'Revisor' | 'Comunicador') => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
    if (savedToken) {
      setToken(savedToken);
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${savedToken}` }
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error('Invalid token');
        })
        .then((data) => setUser(data.user))
        .catch(() => {
          localStorage.removeItem('kodicedu_token');
          localStorage.removeItem('kodic_jwt_token');
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleAuthSuccess = (data: { token: string; user: User }) => {
    localStorage.setItem('kodicedu_token', data.token);
    localStorage.setItem('kodic_jwt_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const login = async (email: string, password: string): Promise<User> => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    handleAuthSuccess(data);
    return data.user;
  };

  const register = async (userData: any): Promise<User> => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    handleAuthSuccess(data);
    return data.user;
  };

  const quickLogin = async (roleOrEmail: 'teacher' | 'student' | string): Promise<User> => {
    const isRole = roleOrEmail === 'teacher' || roleOrEmail === 'student';
    const payload = isRole ? { role: roleOrEmail } : { email: roleOrEmail };
    const res = await fetch('/api/auth/quick-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Quick login failed');
    handleAuthSuccess(data);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('kodicedu_token');
    localStorage.removeItem('kodic_jwt_token');
    setToken(null);
    setUser(null);
  };

  const updateIntelligenceRole = async (newRole: 'Curador' | 'Revisor' | 'Comunicador') => {
    if (!token) return;
    const res = await fetch('/api/auth/profile/intelligence-role', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ intelligenceRole: newRole })
    });
    if (res.ok && user) {
      setUser({ ...user, intelligence_role: newRole });
    }
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user),
        isTeacher: user?.role === 'teacher',
        isStudent: user?.role === 'student',
        isLeader: Boolean(user?.is_leader),
        loading,
        login,
        register,
        quickLogin,
        logout,
        updateIntelligenceRole,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
