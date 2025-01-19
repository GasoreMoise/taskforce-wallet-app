'use client';

import { useBudgets } from '@/lib/hooks/useBudgets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { Progress } from '@/components/ui/Progress';

export function BudgetOverview() {
  const { data: budgets, isLoading } = useBudgets();

  if (isLoading) {
    return <LoadingSkeleton className="h-[300px]" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {budgets?.data.map((budget) => {
          const progress = (budget.spent / budget.amount) * 100;
          const isOverBudget = progress > 100;

          return (
            <div key={budget.id} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{budget.category}</span>
                <span>
                  {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
                </span>
              </div>
              <Progress 
                value={Math.min(progress, 100)} 
                className={isOverBudget ? 'bg-red-200' : ''}
              />
              <p className="text-xs text-muted-foreground">
                {budget.period} budget - Ends {new Date(budget.endDate).toLocaleDateString()}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
} 