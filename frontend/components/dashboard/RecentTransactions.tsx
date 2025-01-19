'use client';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ArrowDownIcon, ArrowUpIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { cn } from '@/lib/utils';
import React from 'react';

interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
}

export function RecentTransactions() {
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ['recentTransactions'],
    queryFn: async () => {
      const response = await apiClient.get('/transactions/recent');
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
    <div className="space-y-4">
      {transactions?.map((transaction) => (
        <Link
          key={transaction.id}
          href={`/transactions/${transaction.id}`}
          className="block hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-4 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div
              className={cn(
                'p-2 rounded-full',
                transaction.type === 'income'
                  ? 'bg-green-100 dark:bg-green-900'
                  : 'bg-red-100 dark:bg-red-900'
              )}
            >
              {transaction.type === 'income' ? (
                <ArrowUpIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {transaction.description}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {transaction.category} • {format(new Date(transaction.date), 'MMM d, yyyy')}
              </p>
            </div>
            <div
              className={cn(
                'text-sm font-medium',
                transaction.type === 'income'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              )}
            >
              {transaction.type === 'income' ? '+' : '-'}$
              {Math.abs(transaction.amount).toLocaleString()}
            </div>
          </div>
        </Link>
      ))}
      
      <Link
        href="/transactions"
        className="block text-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
      >
        View all transactions
      </Link>
    </div>
  );
} 