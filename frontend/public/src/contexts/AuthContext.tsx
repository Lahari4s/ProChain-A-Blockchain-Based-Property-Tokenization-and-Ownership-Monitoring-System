import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import allUsers from '@/data/allUsers';

export type UserRole = 'admin' | 'buyer' | null;

interface User {
  email: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isBuyer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('prochain_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Demo credentials for testing
    // In production, this should call a backend API
    
    if (role === 'admin') {
      // Admin login
      if (email === 'admin@prochain.com' && password === 'admin123') {
        const userData = {
          email: 'admin@prochain.com',
          role: 'admin' as UserRole,
          name: 'Admin User'
        };
        setUser(userData);
        localStorage.setItem('prochain_user', JSON.stringify(userData));
        return true;
      }
    } else if (role === 'buyer') {
      // Check if user exists in the dataset
      const foundUser = allUsers.find(u => u.email === email);
      
      if (foundUser && password === 'buyer123') {
        const userData = {
          email: foundUser.email,
          role: 'buyer' as UserRole,
          name: foundUser.name
        };
        setUser(userData);
        localStorage.setItem('prochain_user', JSON.stringify(userData));
        return true;
      }
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('prochain_user');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isBuyer: user?.role === 'buyer'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
