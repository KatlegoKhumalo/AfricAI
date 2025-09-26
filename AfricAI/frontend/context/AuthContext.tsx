import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { mockLearnerUser } from '../mockData';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updatedFields: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getInitialUser = (): User | null => {
    try {
        const item = window.localStorage.getItem('africai-user');
        if (item) {
            const parsedUser = JSON.parse(item);
            // FIX: Re-hydrate date objects from ISO strings stored in localStorage.
            // This prevents runtime errors when calling Date methods on a string.
            if (parsedUser.joinDate) {
                parsedUser.joinDate = new Date(parsedUser.joinDate);
            }
            // Normalize role to lowercase so UI role checks work after reload
            if (parsedUser.role && typeof parsedUser.role === 'string') {
                parsedUser.role = String(parsedUser.role).toLowerCase();
            }
            // Ensure avatar fallback is applied on reload
            if (!parsedUser.avatarUrl) {
                parsedUser.avatarUrl = '/assets/images/default-avatar.svg';
            }
            return parsedUser;
        }
        return null; // No default user, require authentication
    } catch (error) {
        console.error("Error reading user from localStorage", error);
        return null;
    }
}

const getInitialToken = (): string | null => {
    try {
        return window.localStorage.getItem('africai-token');
    } catch (error) {
        console.error("Error reading token from localStorage", error);
        return null;
    }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getInitialUser);
  const [token, setToken] = useState<string | null>(getInitialToken);

  useEffect(() => {
    try {
        if(user) {
            window.localStorage.setItem('africai-user', JSON.stringify(user));
        } else {
            window.localStorage.removeItem('africai-user');
        }
    } catch(error) {
        console.error("Error saving user to localStorage", error);
    }
  }, [user]);

  useEffect(() => {
    try {
        if(token) {
            window.localStorage.setItem('africai-token', token);
        } else {
            window.localStorage.removeItem('africai-token');
        }
    } catch(error) {
        console.error("Error saving token to localStorage", error);
    }
  }, [token]);

  const login = (userData: User, authToken: string) => {
    // Normalize role casing to match frontend expectations ('learner' | 'tutor' | 'admin')
    const normalizedRole = (userData as any)?.role ? String((userData as any).role).toLowerCase() : undefined;
    const normalizedUser: User = { 
      ...userData, 
      role: (normalizedRole as any),
      avatarUrl: userData.avatarUrl || '/assets/images/default-avatar.svg'
    };
    setUser(normalizedUser);
    setToken(authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const updateUser = (updatedFields: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const newUser = { ...prevUser, ...updatedFields };
      // Also update localStorage
      window.localStorage.setItem('africai-user', JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};