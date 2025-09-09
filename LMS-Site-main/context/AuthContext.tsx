import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { mockLearnerUser } from '../mockData';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
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
            return parsedUser;
        }
        return mockLearnerUser; // Default to mock learner for demo
    } catch (error) {
        console.error("Error reading user from localStorage", error);
        return mockLearnerUser;
    }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getInitialUser);

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

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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