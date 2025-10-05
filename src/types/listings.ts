export interface Listing {
	id: string;
	title: string;
	description: string;
	animalType: string;
	breed?: string;
	location: string;
	photos: string[];
	dateLost: string;
	contactPhone: string;
	userId: string;
	createdAt: string;
	updatedAt: string;
	isFavorite?: boolean;
}

export interface CreateListingInput {
	title: string;
	description: string;
	animalType: string;
	breed?: string;
	location: string;
	photos?: string[];
	dateLost: string;
	contactPhone: string;
}

export interface UpdateListingInput {
	title?: string;
	description?: string;
	animalType?: string;
	breed?: string;
	location?: string;
	photos?: string[];
	dateLost?: string;
	contactPhone?: string;
}

export interface FilterOptions {
	animalType?: string;
	location?: string;
	dateFrom?: Date;
	dateTo?: Date;
	limit?: number;
	offset?: number;
}

export interface FavoriteResponse {
	isFavorite: boolean;
	message: string;
}

export interface ListingsResponse {
	listings: Listing[];
	total: number;
	limit: number;
	offset: number;
	hasNext: boolean;
}

export interface UserListingsResponse {
	listings: Listing[];
	total: number;
}

export interface UserStats {
	totalUsers: number;
	totalListings: number;
}

export interface Comment {
	id: string;
	content: string;
	authorId: string;
	announcementId: string;
	createdAt: string;
	updatedAt: string;
	author: {
		id: string;
		email: string;
	};
}

export interface CreateCommentInput {
	content: string;
	announcementId: string;
}
