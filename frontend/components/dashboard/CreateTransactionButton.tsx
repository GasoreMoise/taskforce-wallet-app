'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from '@/components/ui/Modal';
import { apiClient } from '@/lib/api/client';

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.string().transform((val) => parseFloat(val)),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  accountId: z.string().min(1, 'Account is required'),
  date: z.string().min(1, 'Date is required'),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface Account {
  id: string;
  name: string;
}

export function CreateTransactionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: accounts } = useQuery<Account[]>({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await apiClient.get('/accounts');
      return response.data;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const createTransaction = useMutation({
    mutationFn: async (data: TransactionFormData) => {
      const response = await apiClient.post('/transactions', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      reset();
      setIsOpen(false);
    },
    onError: (error: any) => {
      setError(error.message || 'Failed to create transaction');
    },
  });

  const onSubmit = (data: TransactionFormData) => {
    createTransaction.mutate(data);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      setError(null);
    }
    setIsOpen(open);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Add Transaction
      </Button>

      <Modal open={isOpen} onOpenChange={handleOpenChange}>
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>
              <ModalTitle>Create New Transaction</ModalTitle>
              <ModalDescription>
                Add a new transaction to track your finances
              </ModalDescription>
            </ModalHeader>

            <div className="space-y-4 p-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select {...register('type')} defaultValue="expense">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Amount</label>
                <Input
                  {...register('amount')}
                  type="number"
                  step="0.01"
                  error={errors.amount?.message}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Input
                  {...register('category')}
                  error={errors.category?.message}
                  placeholder="e.g., Groceries, Salary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  {...register('description')}
                  error={errors.description?.message}
                  placeholder="Enter description"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Account</label>
                <Select {...register('accountId')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts?.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input
                  {...register('date')}
                  type="date"
                  error={errors.date?.message}
                />
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>

            <ModalFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createTransaction.isPending}
              >
                {createTransaction.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Transaction
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
} 