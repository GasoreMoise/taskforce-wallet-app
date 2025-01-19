'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from '@/components/ui/Modal';
import React from 'react';

const accountSchema = z.object({
  name: z.string().min(1, 'Account name is required'),
  type: z.enum(['bank', 'credit', 'cash']),
  balance: z.string().transform((val) => parseFloat(val)),
  currency: z.string().min(1, 'Currency is required'),
});

type AccountFormData = z.infer<typeof accountSchema>;

interface CreateAccountModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateAccountModal({ open, onClose }: CreateAccountModalProps) {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      type: 'bank',
      currency: 'USD',
    },
  });

  const createAccount = useMutation({
    mutationFn: async (data: AccountFormData) => {
      const response = await apiClient.post('/accounts', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      reset();
      onClose();
    },
    onError: (error: any) => {
      setError(error.message || 'Failed to create account');
    },
  });

  const onSubmit = (data: AccountFormData) => {
    createAccount.mutate(data);
  };

  return (
    <Modal open={open} onOpenChange={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>
            <ModalTitle>Create New Account</ModalTitle>
            <ModalDescription>
              Add a new account to track your finances
            </ModalDescription>
          </ModalHeader>

          <div className="space-y-4 p-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Name</label>
              <Input
                {...register('name')}
                error={errors.name?.message}
                placeholder="Enter account name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Account Type</label>
              <Select
                {...register('type')}
                defaultValue="bank"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Bank Account</SelectItem>
                  <SelectItem value="credit">Credit Card</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Initial Balance</label>
              <Input
                {...register('balance')}
                type="number"
                step="0.01"
                error={errors.balance?.message}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Currency</label>
              <Select
                {...register('currency')}
                defaultValue="USD"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
              {errors.currency && (
                <p className="text-sm text-red-500">{errors.currency.message}</p>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>

          <ModalFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createAccount.isPending}
            >
              {createAccount.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Account
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
} 