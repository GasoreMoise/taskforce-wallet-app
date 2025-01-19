'use client';

import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import React from 'react';

interface QueryErrorResetBoundaryProps {
  error: Error;
}

export function QueryErrorResetBoundary({ error }: QueryErrorResetBoundaryProps) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/10">
      <div className="flex flex-col items-center space-y-4">
        <p className="text-sm text-red-600 dark:text-red-400">
          {error.message || 'An error occurred while fetching data'}
        </p>
        <Button variant="outline" onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </div>
  );
} 