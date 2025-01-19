import { create } from 'zustand';

interface TransactionsState {
  filters: {
    search: string;
    type: 'all' | 'income' | 'expense';
    category: string | null;
    accountId: string | null;
    startDate: Date | null;
    endDate: Date | null;
  };
  setFilters: (filters: Partial<TransactionsState['filters']>) => void;
  resetFilters: () => void;
}

const initialFilters = {
  search: '',
  type: 'all' as const,
  category: null,
  accountId: null,
  startDate: null,
  endDate: null,
};

export const useTransactionsStore = create<TransactionsState>()((set) => ({
  filters: initialFilters,
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  resetFilters: () => set({ filters: initialFilters }),
})); 