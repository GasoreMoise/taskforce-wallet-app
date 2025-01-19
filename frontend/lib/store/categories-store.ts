import { create } from 'zustand';
import { Category } from '@/types';

interface CategoriesState {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  selectedCategory: string | null;
  setSelectedCategory: (categoryId: string | null) => void;
}

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: [],
  setCategories: (categories) => set({ categories }),
  selectedCategory: null,
  setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),
})); 