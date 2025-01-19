import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { TransactionDetail } from '@/components/dashboard/TransactionDetail';
import { getTransaction } from '@/lib/api/transactions';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const transaction = await getTransaction(params.id);
  return {
    title: `Transaction ${transaction?.id || 'Not Found'}`,
  };
}

export default async function TransactionPage({ params }: Props) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const transaction = await getTransaction(params.id);

  if (!transaction) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Transaction Details</h1>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <TransactionDetail transaction={transaction} />
      </div>
    </div>
  );
} 