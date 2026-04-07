import React, { createContext, useContext, useState, ReactNode } from 'react';
import allUsersData from '@/data/allUsers';
import type { UserData } from '@/data/allUsers';

interface UserContextType {
  users: UserData[];
  addUser: (user: Omit<UserData, 'id' | 'registrationDate'>) => UserData;
  updateUser: (id: number, updates: Partial<UserData>) => void;
  deleteUser: (id: number) => void;
  getUser: (id: number) => UserData | undefined;
  getUserByName: (name: string) => UserData | undefined;
  getUserByEmail: (email: string) => UserData | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserData[]>(allUsersData);

  const addUser = (userData: Omit<UserData, 'id' | 'registrationDate'>) => {
    const newUser: UserData = {
      ...userData,
      id: users.length + 1,
      registrationDate: Date.now().toString(),
      role: userData.role || 'buyer',
      status: userData.status || 'active',
    };

    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const updateUser = (id: number, updates: Partial<UserData>) => {
    setUsers(prev =>
      prev.map(user => (user.id === id ? { ...user, ...updates } : user))
    );
  };

  const deleteUser = (id: number) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const getUser = (id: number) => {
    return users.find(u => u.id === id);
  };

  const getUserByName = (name: string) => {
    return users.find(u => u.name.toLowerCase() === name.toLowerCase());
  };

  const getUserByEmail = (email: string) => {
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  };

  return (
    <UserContext.Provider
      value={{ users, addUser, updateUser, deleteUser, getUser, getUserByName, getUserByEmail }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};
