'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/client';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      
      // Register the user
      const response = await apiClient.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (response.status === 201) {
        // Auto sign in after registration
        const result = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          toast.error('Failed to sign in after registration');
          return;
        }

        toast.success('Registration successful!');
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {Object.keys(errors).length > 0 && (
        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 rounded-lg">
          {Object.values(errors).map((error, index) => (
            <div key={index}>{error.message}</div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Name</label>
        <Input
          {...register('name')}
          type="text"
          error={errors.name?.message}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input
          {...register('email')}
          type="email"
          error={errors.email?.message}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <Input
          {...register('password')}
          type="password"
          error={errors.password?.message}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Confirm Password</label>
        <Input
          {...register('confirmPassword')}
          type="password"
          error={errors.confirmPassword?.message}
          disabled={isLoading}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Registering...
          </>
        ) : (
          'Register'
        )}
      </Button>

      <p className="text-sm text-center text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link href="/login" className="text-primary-600 hover:text-primary-500">
          Sign in
        </Link>
      </p>
    </form>
  );
}