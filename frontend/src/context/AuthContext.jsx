import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUser, setUser as saveUser, clearAuth, isAuthenticated } from '../utils/authHelper';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      if (isAuthenticated()) {
        const savedUser = getUser();
        setUser(savedUser);
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
    saveUser(userData);
  };

  const logout = () => {
    // Try to notify backend to blacklist the refresh token, but always
    // clear local auth state to avoid leaving UI in an inconsistent state.
    const doLogout = async () => {
      try {
        const refresh = localStorage.getItem('refresh_token');
        if (refresh) {
          await api.post('/auth/logout/', { refresh_token: refresh });
        }
      } catch (err) {
        // ignore network errors; proceed to clear local auth
      } finally {
        setUser(null);
        clearAuth();
      }
    };

    void doLogout();
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
