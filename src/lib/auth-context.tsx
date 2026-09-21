'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/nameplate';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password?: string, role?: 'customer' | 'admin') => Promise<User>;
  register: (name: string, email: string, phone: string, password?: string) => Promise<User>;
  logout: () => void;
  switchRole: (role: 'customer' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_USERS: Record<'customer' | 'admin', User> = {
  customer: {
    id: 'usr-cust-01',
    name: 'Md. Anisur Rahman',
    email: 'customer@example.com',
    phone: '+880 1711-223344',
    role: 'customer',
    createdAt: '2026-01-10T10:00:00Z'
  },
  admin: {
    id: 'usr-admin-01',
    name: 'Sun3D Operations Admin',
    email: 'admin@sun3d.com',
    phone: '+880 1800-SUN3D',
    role: 'admin',
    createdAt: '2026-01-01T08:00:00Z'
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sun3d_current_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load user session', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, _password?: string, role?: 'customer' | 'admin'): Promise<User> => {
    // If logging in as admin or email starts with admin
    const resolvedRole: 'customer' | 'admin' = role || (email.toLowerCase().includes('admin') ? 'admin' : 'customer');
    const existing = resolvedRole === 'admin' ? DEMO_USERS.admin : DEMO_USERS.customer;
    
    const loggedUser: User = {
      ...existing,
      email,
      name: email === DEMO_USERS.customer.email ? DEMO_USERS.customer.name : (resolvedRole === 'admin' ? 'Admin Manager' : email.split('@')[0])
    };

    localStorage.setItem('sun3d_current_user', JSON.stringify(loggedUser));
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (name: string, email: string, phone: string, _password?: string): Promise<User> => {
    const newUser: User = {
      id: `usr-cust-${Date.now().toString().slice(-4)}`,
      name,
      email,
      phone,
      role: 'customer',
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('sun3d_current_user', JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('sun3d_current_user');
    setUser(null);
  };

  const switchRole = (role: 'customer' | 'admin') => {
    const newUser = DEMO_USERS[role];
    localStorage.setItem('sun3d_current_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, switchRole }}>
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
