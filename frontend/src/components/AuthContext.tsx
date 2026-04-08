import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../lib/api';

export type Role = 'admin' | 'teacher' | 'student';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  streak?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await api.get('/me');
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = (userData: User, newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (e) {
      // Ignore errors on logout
    }
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
