import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  selectedAccountId: string | null;
  setSelectedAccountId: (id: string | null) => void;
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
  setDateRange: (range: { startDate: Date | null; endDate: Date | null }) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      selectedAccountId: null,
      setSelectedAccountId: (id) => set({ selectedAccountId: id }),
      dateRange: {
        startDate: null,
        endDate: null,
      },
      setDateRange: (range) => set({ dateRange: range }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        selectedAccountId: state.selectedAccountId,
      }),
    }
  )
); 