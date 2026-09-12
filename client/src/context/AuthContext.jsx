import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('kodic_jwt_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await api.auth.me();
        setUser(data.user);
      } catch {
        localStorage.removeItem('kodic_jwt_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [token]);

  const handleAuthSuccess = (data) => {
    localStorage.setItem('kodic_jwt_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const login = async (email, password) => {
    const data = await api.auth.login(email, password);
    handleAuthSuccess(data);
    return data.user;
  };

  const register = async (userData) => {
    const data = await api.auth.register(userData);
    handleAuthSuccess(data);
    return data.user;
  };

  const quickLogin = async (role) => {
    const data = await api.auth.quickLogin(role);
    handleAuthSuccess(data);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('kodic_jwt_token');
    setToken(null);
    setUser(null);
  };

  const updateIntelligenceRole = async (newRole) => {
    await api.auth.updateIntelligenceRole(newRole);
    if (user) {
      setUser({ ...user, intelligence_role: newRole });
    }
  };

  const refreshUser = async () => {
    try {
      const data = await api.auth.me();
      setUser(data.user);
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
