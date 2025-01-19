import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { ReportGenerator } from '@/components/dashboard/ReportGenerator';
import { ReportFilters } from '@/components/dashboard/ReportFilters';
import { ReportCharts } from '@/components/dashboard/ReportCharts';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const metadata: Metadata = {
  title: 'Reports',
};

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports</h1>
        <ReportGenerator />
      </div>

      <ReportFilters />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <ReportCharts />
        </div>
      </div>
    </div>
  );
} 