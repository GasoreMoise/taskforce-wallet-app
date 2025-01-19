'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ArrowDownIcon, ArrowUpIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import React from 'react';

interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
  account: {
    id: string;
    name: string;
  };
}

interface TransactionListResponse {
  data: Transaction[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export function TransactionList() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery<TransactionListResponse>({
    queryKey: ['transactions', page],
    queryFn: async () => {
      const response = await apiClient.get('/transactions', {
        params: { page, limit },
      });
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
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Account</th>
              <th className="px-4 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-3 text-sm">
                  {format(new Date(transaction.date), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/transactions/${transaction.id}`}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
                  >
                    {transaction.description}
                  </Link>
                </td>
                <td className="px-4 py-3">{transaction.category}</td>
                <td className="px-4 py-3">{transaction.account.name}</td>
                <td className={cn(
                  'px-4 py-3 text-right',
                  transaction.type === 'income'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                )}>
                  {transaction.type === 'income' ? '+' : '-'}$
                  {Math.abs(transaction.amount).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data?.meta && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Showing {((page - 1) * limit) + 1} to{' '}
            {Math.min(page * limit, data.meta.total)} of {data.meta.total} results
          </p>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage(p => p + 1)}
              disabled={page * limit >= data.meta.total}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 