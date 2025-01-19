import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  currency: string;
  language: string;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  setCurrency: (currency: string) => void;
  setLanguage: (language: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setNotifications: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      currency: 'USD',
      language: 'en',
      theme: 'system',
      notifications: true,
      setCurrency: (currency) => set({ currency }),
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      setNotifications: (notifications) => set({ notifications }),
    }),
    {
      name: 'wallet-settings',
    }
  )
); 