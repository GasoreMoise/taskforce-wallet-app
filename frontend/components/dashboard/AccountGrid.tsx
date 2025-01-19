'use client';

import { useQuery } from '@tanstack/react-query';
import { Loader2, CreditCard, Wallet, Building, Plus } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CreateAccountModal } from './CreateAccountModal';
import { useState } from 'react';
import React from 'react';

interface Account {
  id: string;
  name: string;
  type: 'bank' | 'credit' | 'cash';
  balance: number;
  currency: string;
  lastUpdated: string;
}

export function AccountGrid() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const { data: accounts, isLoading } = useQuery<Account[]>({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await apiClient.get('/accounts');
      return response.data;
    },
  });

  const getAccountIcon = (type: Account['type']) => {
    switch (type) {
      case 'bank':
        return <Building className="h-8 w-8 text-blue-600 dark:text-blue-400" />;
      case 'credit':
        return <CreditCard className="h-8 w-8 text-purple-600 dark:text-purple-400" />;
      case 'cash':
        return <Wallet className="h-8 w-8 text-green-600 dark:text-green-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {accounts?.map((account) => (
          <Card key={account.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {account.name}
              </CardTitle>
              {getAccountIcon(account.type)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {account.currency}
                {account.balance.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date(account.lastUpdated).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
        
        <Card className="border-2 border-dashed">
          <Button
            variant="ghost"
            className="h-full w-full"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <div className="flex flex-col items-center justify-center">
              <Plus className="h-8 w-8 mb-2" />
              <span>Add Account</span>
            </div>
          </Button>
        </Card>
      </div>

      <CreateAccountModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
} 