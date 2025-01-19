import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { BudgetList } from '@/components/dashboard/BudgetList';
import { CreateBudgetButton } from '@/components/dashboard/CreateBudgetButton';
import { BudgetOverview } from '@/components/dashboard/BudgetOverview';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const metadata: Metadata = {
  title: 'Budgets',
};

export default async function BudgetsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Budgets</h1>
        <CreateBudgetButton />
      </div>

      <BudgetOverview />
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <BudgetList />
      </div>
    </div>
  );
} 