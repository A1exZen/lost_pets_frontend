import axiosConfig from '../config/axiosConfig';
import type {
  CreateListingInput,
  FavoriteResponse,
  FilterOptions,
  Listing,
  ListingsResponse,
  UpdateListingInput
} from '../types/listings';

export const listingsApi = {
  create: async (data: CreateListingInput | FormData): Promise<Listing> => {
    const response = await axiosConfig.post('/api/listings', data, {
      headers: {
        'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json'
      }
    });
    return response.data;
  },

  getById: async (id: string): Promise<Listing> => {
    const response = await axiosConfig.get(`/api/listings/${id}`);
    return response.data;
  },

  update: async (id: string, data: UpdateListingInput): Promise<Listing> => {
    const response = await axiosConfig.put(`/api/listings/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosConfig.delete(`/api/listings/${id}`);
  },

  search: async (filters: FilterOptions = {}): Promise<ListingsResponse> => {
    const params = new URLSearchParams();

    if (filters.animalType) params.append('animalType', filters.animalType);
    if (filters.location) params.append('location', filters.location);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom.toISOString().split('T')[0]);
    if (filters.dateTo) params.append('dateTo', filters.dateTo.toISOString().split('T')[0]);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());

    const queryString = params.toString();
    const url = queryString ? `/api/listings?${queryString}` : '/api/listings';

    const response = await axiosConfig.get(url);
    return response.data;
  },

  toggleFavorite: async (listingId: string): Promise<FavoriteResponse> => {
    const response = await axiosConfig.post(`/api/listings/${listingId}/favorite`);
    return response.data;
  },

  getUserFavorites: async (): Promise<Listing[]> => {
    const response = await axiosConfig.get('/api/listings/favorites');
    return response.data;
  },

  getUserListings: async (): Promise<Listing[]> => {
    const response = await axiosConfig.get('/api/users/listings');
    return response.data;
  }
};