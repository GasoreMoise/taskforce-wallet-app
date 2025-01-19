'use client';

import { useAccounts } from '@/lib/hooks/useAccounts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { CreditCard, Wallet, Building } from 'lucide-react';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';

const accountTypeIcons = {
  bank: Building,
  credit: CreditCard,
  cash: Wallet,
};

export function AccountSummary() {
  const { data: accounts, isLoading } = useAccounts();

  if (isLoading) {
    return <LoadingSkeleton className="h-[200px]" />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {accounts?.data.map((account) => {
        const Icon = accountTypeIcons[account.type];
        return (
          <Card key={account.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {account.name}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(account.balance, account.currency)}
              </div>
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date(account.lastUpdated).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 