import { listingsApi } from '@/api/listings.ts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateListingInput, FilterOptions, Listing, UpdateListingInput, UserListingsResponse } from '../types/listings.ts';


export const useListings = (filters?: FilterOptions) => {
  return useQuery<UserListingsResponse>({
    queryKey: ['listings', filters],
    queryFn: () => listingsApi.search(filters || {}),
    staleTime: 5 * 60 * 1000,
  });
};

export const useListing = (id: string) => {
  return useQuery<Listing>({
    queryKey: ['listing', id],
    queryFn: () => listingsApi.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateListingInput) => listingsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
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
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
    },
  });
};

export const useDeleteListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => listingsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['user-listings'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listingId: string) => listingsApi.toggleFavorite(listingId),
    onSuccess: (result, listingId) => {
      queryClient.setQueryData(['listing', listingId], (oldData: any) => ({
        ...oldData,
        isFavorite: result.isFavorite,
      }));

      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
};

export const useUserFavorites = () => {
  return useQuery<Listing[]>({
    queryKey: ['favorites'],
    queryFn: listingsApi.getUserFavorites,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserListings = () => {
  return useQuery({
    queryKey: ['user-listings'],
    queryFn: listingsApi.getUserListings,
    staleTime: 5 * 60 * 1000,
  });
};