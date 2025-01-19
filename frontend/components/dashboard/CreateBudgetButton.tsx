'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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

const budgetSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  amount: z.string().transform((val) => parseFloat(val)),
  period: z.enum(['monthly', 'yearly']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

export function CreateBudgetButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      period: 'monthly',
    },
  });

  const createBudget = useMutation({
    mutationFn: async (data: BudgetFormData) => {
      const response = await apiClient.post('/budgets', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      reset();
      setIsOpen(false);
    },
    onError: (error: any) => {
      setError(error.message || 'Failed to create budget');
    },
  });

  const onSubmit = (data: BudgetFormData) => {
    createBudget.mutate(data);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Create Budget
      </Button>

      <Modal open={isOpen} onOpenChange={setIsOpen}>
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>
              <ModalTitle>Create New Budget</ModalTitle>
              <ModalDescription>
                Set up a new budget to track your spending
              </ModalDescription>
            </ModalHeader>

            <div className="space-y-4 p-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Input
                  {...register('category')}
                  error={errors.category?.message}
                  placeholder="e.g., Groceries, Entertainment"
                />
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
                <label className="text-sm font-medium">Period</label>
                <Select
                  {...register('period')}
                  defaultValue="monthly"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    {...register('startDate')}
                    type="date"
                    error={errors.startDate?.message}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Input
                    {...register('endDate')}
                    type="date"
                    error={errors.endDate?.message}
                  />
                </div>
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
                disabled={createBudget.isPending}
              >
                {createBudget.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Budget
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
} 