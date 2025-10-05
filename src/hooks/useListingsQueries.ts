import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listingsApi } from '../api/listings';
import type { CreateListingInput, FilterOptions, UpdateListingInput } from '../types/listings';

export const useListings = (filters?: FilterOptions) => {
	return useQuery({
		queryKey: ['listings', filters],
		queryFn: () => listingsApi.search(filters),
	});
};

export const useListing = (id: string) => {
	return useQuery({
		queryKey: ['listing', id],
		queryFn: () => listingsApi.getById(id),
		enabled: !!id,
	});
};

export const useCreateListing = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateListingInput | FormData) => listingsApi.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['listings'] });
			queryClient.invalidateQueries({ queryKey: ['userListings'] });
		},
	});
};

export const useUpdateListing = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateListingInput }) =>
			listingsApi.update(id, data),
		onSuccess: (updatedListing) => {
			queryClient.setQueryData(['listing', updatedListing.id], updatedListing);
			queryClient.invalidateQueries({ queryKey: ['listings'] });
			queryClient.invalidateQueries({ queryKey: ['userListings'] });
		},
	});
};

export const useDeleteListing = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => listingsApi.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['listings'] });
			queryClient.invalidateQueries({ queryKey: ['userListings'] });
			queryClient.invalidateQueries({ queryKey: ['favorites'] });
		},
	});
};

export const useUserListings = () => {
	return useQuery({
		queryKey: ['userListings'],
		queryFn: listingsApi.getUserListings,
	});
};

export const useFavorites = () => {
	return useQuery({
		queryKey: ['favorites'],
		queryFn: listingsApi.getUserFavorites,
	});
};

export const useToggleFavorite = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (listingId: string) => listingsApi.toggleFavorite(listingId),
		onSuccess: (_, listingId) => {
			queryClient.invalidateQueries({ queryKey: ['favorites'] });
			queryClient.invalidateQueries({ queryKey: ['listing', listingId] });
			queryClient.invalidateQueries({ queryKey: ['listings'] });
		},
	});
};
