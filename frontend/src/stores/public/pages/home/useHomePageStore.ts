import { CruddableTypes } from '@shared/src';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Values = {
  filters: CruddableTypes<'APARTMENT'>['filters'];
  is_apartments_loading: boolean;
}

type Actions = {
  setFilters: (filters: CruddableTypes<'APARTMENT'>['filters']) => void;
  setIsApartmentsLoading: (is_apartments_loading: boolean) => void;
}


export const useHomePageStore = create<Values & Actions>()(
  persist(
    (set) => (
      {
        // Initial state
        is_apartments_loading: false,
        filters: { skip: 0, take: 10 },

        // Methods to change state
        setFilters: (filters) => set({ filters }),
        setIsApartmentsLoading: (is_apartments_loading) => set({ is_apartments_loading }),
      }
    ),
    {
      name: 'home-page-storage', // name for storing in localStorage
    }
  )
)