import { Toast } from '@/components/ui/Toast';
import { AxiosError } from 'axios';
import { signOut } from 'next-auth/react';

export function handleApiError(error: unknown) {
  if (error instanceof AxiosError) {
    // Handle unauthorized errors
    if (error.response?.status === 401) {
      signOut({ callbackUrl: '/login' });
      return;
    }

    // Handle forbidden errors
    if (error.response?.status === 403) {
      Toast({
        title: 'Access Denied',
        description: 'You do not have permission to perform this action',
        variant: 'destructive',
      });
      return;
    }

    // Handle validation errors
    if (error.response?.status === 422) {
      const validationErrors = error.response.data.errors;
      Object.values(validationErrors).forEach((message: any) => {
        Toast({
          title: 'Validation Error',
          description: message,
          variant: 'destructive',
        });
      });
      return;
    }

    // Handle other API errors
    Toast({
      title: 'Error',
      description: error.response?.data?.message || 'An unexpected error occurred',
      variant: 'destructive',
    });
    return;
  }

  // Handle other errors
  Toast({
    title: 'Error',
    description: 'An unexpected error occurred',
    variant: 'destructive',
  });
} 