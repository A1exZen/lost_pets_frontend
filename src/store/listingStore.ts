import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FilterOptions } from '../types/listings';

interface ListingState {
  filters: FilterOptions;
  currentListingId: string | null;

  setFilters: (filters: FilterOptions) => void;
  setCurrentListingId: (id: string | null) => void;
  clearFilters: () => void;
}

export const useListingStore = create<ListingState>()(
  persist(
    (set) => ({
      filters: {},
      currentListingId: null,

      setFilters: (filters) => {
        set({ filters });
      },

      setCurrentListingId: (id) => {
        set({ currentListingId: id });
      },

      clearFilters: () => {
        set({ filters: {} });
      },
    }),
    {
      name: 'listing-ui-storage',
      partialize: (state) => ({ filters: state.filters }),
    }
  )
);