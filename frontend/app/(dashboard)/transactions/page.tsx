import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { TransactionList } from '@/components/dashboard/TransactionList';
import { CreateTransactionButton } from '@/components/dashboard/CreateTransactionButton';
import { TransactionFilters } from '@/components/dashboard/TransactionFilters';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const metadata: Metadata = {
  title: 'Transactions',
};

export default async function TransactionsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <CreateTransactionButton />
      </div>
      
      <TransactionFilters />
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <TransactionList />
      </div>
    </div>
  );
} 