'use client';

import { useQuery } from '@tanstack/react-query';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { apiClient } from '@/lib/api/client';
import { Loader2 } from 'lucide-react';
import React from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartDataPoint {
  date: string;
  income: number;
  expenses: number;
}

export function DashboardChart() {
  const { data: chartData, isLoading } = useQuery<ChartDataPoint[]>({
    queryKey: ['dashboardChart'],
    queryFn: async () => {
      const response = await apiClient.get('/dashboard/chart');
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

  const data: ChartData<'line'> = {
    labels: chartData?.map(point => point.date) ?? [],
    datasets: [
      {
        label: 'Income',
        data: chartData?.map(point => point.income) ?? [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Expenses',
        data: chartData?.map(point => point.expenses) ?? [],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `$${value}`,
        },
      },
    },
  };

  return (
    <div className="h-[300px]">
      <Line data={data} options={options as any} />
    </div>
  );
}