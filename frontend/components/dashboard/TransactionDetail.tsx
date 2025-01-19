'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';

interface TransactionDetailProps {
  transactionId: string;
}

export function TransactionDetail({ transactionId }: TransactionDetailProps) {
  const { data: transaction, isLoading } = useQuery({
    queryKey: ['transactions', transactionId],
    queryFn: async () => {
      const response = await apiClient.get(`/transactions/${transactionId}`);
      return response.data;
    },
    enabled: !!transactionId,
  });

  if (isLoading) {
    return <LoadingSkeleton className="h-[200px]" />;
  }

  if (!transaction) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Amount</p>
            <p className={`text-xl font-bold ${
              transaction.type === 'expense' ? 'text-red-500' : 'text-green-500'
            }`}>
              {formatCurrency(transaction.amount)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Date</p>
            <p className="text-xl">{formatDate(transaction.date)}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Category</p>
            <p className="text-xl">{transaction.category}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Account</p>
            <p className="text-xl">{transaction.account.name}</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">Description</p>
          <p className="text-gray-600 dark:text-gray-400">
            {transaction.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 