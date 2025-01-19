'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';


import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/Progress';
import { apiClient } from '@/lib/api/client';
import { cn } from '@/lib/utils';
import React from 'react';

interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  period: 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
}

export function BudgetList() {
  const { data: budgets, isLoading } = useQuery<Budget[]>({
    queryKey: ['budgets'],
    queryFn: async () => {
      const response = await apiClient.get('/budgets');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {budgets?.map((budget) => {
        const percentage = (budget.spent / budget.amount) * 100;
        const isOverBudget = percentage > 100;

        return (
          <div key={budget.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{budget.category}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} Budget
                </p>
              </div>
              <div className="text-right">
                <p className={cn(
                  'font-medium',
                  isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'
                )}>
                  ${budget.spent.toLocaleString()} of ${budget.amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {percentage.toFixed(1)}% used
                </p>
              </div>
            </div>
            
            <Progress
              value={Math.min(percentage, 100)}
              className={cn(
                isOverBudget ? 'text-red-600' : 'text-primary-600'
              )}
            />

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
            </p>
          </div>
        );
      })}

      {budgets?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No budgets found. Create a budget to start tracking your spending.
          </p>
        </div>
      )}
    </div>
  );
}