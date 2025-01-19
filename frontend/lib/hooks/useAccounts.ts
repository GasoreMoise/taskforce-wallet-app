import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Account, ApiResponse } from '@/types';

export function useAccounts() {
  return useQuery<ApiResponse<Account[]>>({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await apiClient.get('/accounts');
      return response.data;
    },
  });
}

export function useAccount(accountId: string) {
  return useQuery<Account>({
    queryKey: ['accounts', accountId],
    queryFn: async () => {
      const response = await apiClient.get(`/accounts/${accountId}`);
      return response.data;
    },
    enabled: !!accountId,
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (account: Partial<Account>) => {
      const response = await apiClient.post('/accounts', account);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}

export function useUpdateAccount(accountId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (account: Partial<Account>) => {
      const response = await apiClient.patch(`/accounts/${accountId}`, account);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}