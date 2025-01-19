import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { AccountGrid } from '@/components/dashboard/AccountGrid';
import { CreateAccountButton } from '@/components/dashboard/CreateAccountButton';
import { AccountSummary } from '@/components/dashboard/AccountSummary';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const metadata: Metadata = {
  title: 'Accounts',
};

export default async function AccountsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Accounts</h1>
        <CreateAccountButton />
      </div>

      <AccountSummary />
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <AccountGrid />
      </div>
    </div>
  );
} 