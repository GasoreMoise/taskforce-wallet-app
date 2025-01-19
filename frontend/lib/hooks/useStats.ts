import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Period } from '@/types';

interface Stats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  categoryBreakdown: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  trends: {
    date: string;
    income: number;
    expenses: number;
  }[];
}

export function useStats(period: Period = 'monthly') {
  return useQuery<Stats>({
    queryKey: ['stats', period],
    queryFn: async () => {
      const response = await apiClient.get(`/stats?period=${period}`);
      return response.data;
    },
  });
}

export function useCategoryStats(categoryId: string, period: Period = 'monthly') {
  return useQuery<Stats>({
    queryKey: ['categoryStats', categoryId, period],
    queryFn: async () => {
      const response = await apiClient.get(
        `/stats/categories/${categoryId}?period=${period}`
      );
      return response.data;
    },
    enabled: !!categoryId,
  });
} 