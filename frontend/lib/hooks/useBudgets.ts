import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Budget, ApiResponse } from '@/types';

export function useBudgets() {
  return useQuery<ApiResponse<Budget[]>>({
    queryKey: ['budgets'],
    queryFn: async () => {
      const response = await apiClient.get('/budgets');
      return response.data;
    },
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (budget: Partial<Budget>) => {
      const response = await apiClient.post('/budgets', budget);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
}

export function useUpdateBudget(budgetId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (budget: Partial<Budget>) => {
      const response = await apiClient.patch(`/budgets/${budgetId}`, budget);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
} 