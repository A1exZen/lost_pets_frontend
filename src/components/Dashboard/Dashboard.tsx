import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.scss';
import { useAuth } from '@/hooks/useAuth';
import type { Pet } from '@/types/Pet';
import { deletePet, getUserPets } from '@/services/api';

export const Dashboard: React.FC = () => {
	const { user } = useAuth();
	const [pets, setPets] = useState<Pet[]>([]);
	const [loading, setLoading] = useState(true);
	
	useEffect(() => {
		if (user) {
			getUserPets(user.id).then(data => {
				setPets(data);
				setLoading(false);
			});
		}
	}, [user]);
	
	const handleDelete = async (id: number) => {
		try {
			await deletePet(id);
			setPets(pets.filter(p => p.id !== id));
		} catch {
			console.error('Error deleting pet');
		}
	};
	
	if (loading) return <div className={styles.loading}>Загрузка...</div>;
	
	return (
		<div className={styles.container}>
			<h1>Личный кабинет {user?.name}</h1>
			<Link to="/add-pet" className={styles.button}>Добавить питомца</Link>
			<PetList pets={pets} showActions={true} onDelete={handleDelete} />
		</div>
	);
};