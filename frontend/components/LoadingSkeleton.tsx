import { cn } from '@/lib/utils';
import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

export function LoadingSkeleton({ className, count = 1 }: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'animate-pulse rounded-md bg-gray-200 dark:bg-gray-700',
            className
          )}
        />
      ))}
    </>
  );
}

export function TransactionSkeleton() {
  return (
    <div className="space-y-4">
      <LoadingSkeleton className="h-16" count={5} />
    </div>
  );
}

export function AccountSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <LoadingSkeleton className="h-32" count={3} />
    </div>
  );
} 