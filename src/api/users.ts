import type { User } from '@/types/auth';
import axiosConfig from '../config/axiosConfig';
import type { UserStats } from '../types/listings';

export const usersApi = {
	getProfile: async (): Promise<User> => {
		const response = await axiosConfig.get('/api/users/profile');
		return response.data;
	},

	updateProfile: async (data: { role?: string }): Promise<User> => {
		const response = await axiosConfig.put('/api/users/profile', data);
		return response.data;
	},

	getUserStats: async (): Promise<UserStats> => {
		const response = await axiosConfig.get('/api/users/stats');
		return response.data;
	},

	getAll: async (): Promise<User[]> => {
		const response = await axiosConfig.get('/api/users');
		return response.data;
	},

	delete: async (id: string): Promise<void> => {
		await axiosConfig.delete(`/api/users/${id}`);
	}
};
