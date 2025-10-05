import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../api/auth';
import { usersApi } from '../api/users';
import type { User } from '../types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      setToken: (token) => {
        set({ token });
        localStorage.setItem('token', token || '');
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });
          const response = await authService.login({ email, password });
          localStorage.setItem('token', response.token);

          let profile: User | null = null;
          try {
            profile = await usersApi.getProfile();
          } catch {
            profile = null;
          }

          set({
            user: (profile as User) ?? response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (email: string, password: string) => {
        try {
          set({ isLoading: true });
          const response = await authService.register({ email, password });
          localStorage.setItem('token', response.token);

          let profile: User | null = null;
          try {
            profile = await usersApi.getProfile();
          } catch {
            profile = null;
          }

          set({
            user: (profile as User) ?? response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('token');
        localStorage.removeItem('auth-storage');
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isAuthenticated = !!state.user && !!state.token;
        }
      },
    }
  )
);