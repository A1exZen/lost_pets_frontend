import { Loading } from '@/components/Loading';
import { loginUser, registerUser } from '@/services/api';
import type { AuthContextType } from '@/types/AuthContextType';
import type { User } from '@/types/User';
import React, { createContext, type ReactNode, useEffect, useState } from 'react';


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        if (parsedUser.id && parsedUser.email && parsedUser.name) {
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const foundUser = await loginUser(email, password);
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Ошибка входа');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const newUser = await registerUser(email, password, name);
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (isLoading && !user) {
    return <Loading/>
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};