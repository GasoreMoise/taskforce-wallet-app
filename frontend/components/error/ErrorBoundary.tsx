'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import React from 'react';

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({
  error,
  reset,
}: ErrorBoundaryProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Something went wrong!
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="mt-6">
          <Button onClick={reset}>Try again</Button>
        </div>
      </div>
    </div>
  );
} 