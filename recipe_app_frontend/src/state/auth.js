import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { storage } from '../utils/storage';
import { AuthAPI } from '../api/client';

export const authEvents = new EventTarget();

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access authentication context containing user, token, and actions. */
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /**
   * Provides authentication state and actions to children.
   * Persists token and user in localStorage. Listens to 401 events to logout.
   */
  const [token, setToken] = useState(storage.getToken());
  const [user, setUser] = useState(storage.getUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Listen for global logout (401 handler)
  useEffect(() => {
    const onLogout = () => logout();
    authEvents.addEventListener('logout', onLogout);
    return () => authEvents.removeEventListener('logout', onLogout);
  }, []);

  useEffect(() => {
    storage.setToken(token);
  }, [token]);

  useEffect(() => {
    storage.setUser(user);
  }, [user]);

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const data = await AuthAPI.login({ email, password });
      // Expect { access_token, user }
      setToken(data.access_token || data.token);
      setUser(data.user || null);
      return true;
    } catch (e) {
      setError(e?.response?.data?.detail || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setError(null);
    setLoading(true);
    try {
      const data = await AuthAPI.register(payload);
      // Auto login if returned token
      if (data?.access_token || data?.token) {
        setToken(data.access_token || data.token);
        setUser(data.user || { email: payload.email, name: payload.name });
      }
      return true;
    } catch (e) {
      setError(e?.response?.data?.detail || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    storage.clear();
  };

  const value = useMemo(
    () => ({ token, user, loading, error, login, logout, register, setError }),
    [token, user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
