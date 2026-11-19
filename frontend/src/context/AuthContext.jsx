import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, setAuthToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore authenticated session on initial page load
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await authService.getMe();
        if (response.success && response.user) {
          setUser(response.user);
        }
      } catch (err) {
        // Clear invalid token if session restoration fails
        setAuthToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
    const response = await authService.login({ email, password });
    if (response.success && response.user) {
      setUser(response.user);
    }
    return response;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    if (response.success && response.user) {
      setUser(response.user);
    }
    return response;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (profileData) => {
    const response = await authService.updateProfile(profileData);
    if (response.success && response.user) {
      setUser((prev) => ({ ...prev, ...response.user }));
    }
    return response;
  };

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
