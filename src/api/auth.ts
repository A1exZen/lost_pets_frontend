import type { AuthResponse, LoginInput, RegisterInput } from '../types/auth.ts';
import axiosConfig from '@/config/axiosConfig.ts';


export const authService = {
  login: async (data: LoginInput): Promise<AuthResponse> => {
    const response = await axiosConfig.post('/auth/login', data);
    return response.data;
  },
  
  register: async (data: RegisterInput): Promise<AuthResponse> => {
    const response = await axiosConfig.post('/auth/register', data);
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    localStorage.removeItem('token');
  },
};