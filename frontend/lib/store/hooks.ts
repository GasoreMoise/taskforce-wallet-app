import { useEffect, useState } from 'react';
import { useAppStore } from './store';
import { useSettingsStore } from './settings-store';
import { useTransactionsStore } from './transactions-store';

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}

export function useIsSidebarOpen() {
  const hydrated = useHydrated();
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);

  return {
    isOpen: hydrated ? sidebarOpen : true,
    setIsOpen: setSidebarOpen,
    toggle: toggleSidebar,
  };
}

export function useSettings() {
  const hydrated = useHydrated();
  const settings = useSettingsStore();

  return {
    ...settings,
    isReady: hydrated,
  };
}

export function useTransactionFilters() {
  const filters = useTransactionsStore((state) => state.filters);
  const setFilters = useTransactionsStore((state) => state.setFilters);
  const resetFilters = useTransactionsStore((state) => state.resetFilters);

  return {
    filters,
    setFilters,
    resetFilters,
  };
} 