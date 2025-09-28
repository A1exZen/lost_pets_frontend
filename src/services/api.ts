import axios from 'axios';
import type { Pet } from '../types/Pet';
import type { User } from '../types/User';

const API_URL = import.meta.env.VITE_API_DEV_BASE_URL || 'https://68d4d37ce29051d1c0ac3099.mockapi.io/api';

export const loginUser = async (email: string, password: string): Promise<User> => {
	try {
		const { data: users } = await axios.get<User[]>(`${API_URL}/users?email=${email}`);
		const user = users[0];
		if (!user || user.password !== password) {
			throw new Error('Неверный email или пароль');
		}
		return user;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.status === 404) {
			throw new Error('Пользователь не найден');
		}
		throw new Error('Ошибка входа: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
	}
};

export const registerUser = async (email: string, password: string, name: string): Promise<User> => {
	try {
		const { data: users } = await axios.get<User[]>(`${API_URL}/users?email=${email}`).catch(error => {
			if (axios.isAxiosError(error) && error.response?.status === 404) {
				return { data: [] };
			}
			throw error;
		});

		if (users.length > 0) {
			throw new Error('Пользователь с таким email уже существует');
		}

		const newUser = { email, password, name };
		const { data } = await axios.post<User>(`${API_URL}/users`, newUser);
		return data;
	} catch (error) {
		throw new Error('Ошибка регистрации: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
	}
};

export const getPets = async (): Promise<Pet[]> => {
	try {
		const { data } = await axios.get<Pet[]>(`${API_URL}/pets`);
		return data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.status === 404) {
			return [];
		}
		throw new Error('Ошибка получения питомцев: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
	}
};

export const getUserPets = async (userId: number): Promise<Pet[]> => {
	try {
		const { data } = await axios.get<Pet[]>(`${API_URL}/pets?userId=${userId}`);
		return data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.status === 404) {
			return [];
		}
		throw new Error('Ошибка получения питомцев пользователя: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
	}
};

export const getPetById = async (id: number): Promise<Pet> => {
	try {
		const { data } = await axios.get<Pet>(`${API_URL}/pets/${id}`);
		return data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.status === 404) {
			throw new Error('Питомец не найден');
		}
		throw new Error('Ошибка получения питомца: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
	}
};

export const addPet = async (pet: Omit<Pet, 'id'>): Promise<Pet> => {
	try {
		const { data } = await axios.post<Pet>(`${API_URL}/pets`, pet);
		return data;
	} catch (error) {
		throw new Error('Ошибка добавления питомца: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
	}
};

export const updatePet = async (id: number, pet: Partial<Pet>): Promise<Pet> => {
	try {
		const { data } = await axios.put<Pet>(`${API_URL}/pets/${id}`, pet);
		return data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.status === 404) {
			throw new Error('Питомец не найден');
		}
		throw new Error('Ошибка обновления питомца: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
	}
};

export const deletePet = async (id: number): Promise<void> => {
	try {
		await axios.delete(`${API_URL}/pets/${id}`);
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.status === 404) {
			throw new Error('Питомец не найден');
		}
		throw new Error('Ошибка удаления питомца: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
	}
};