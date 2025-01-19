import { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/RegisterForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Register | Task Force Pro Wallet',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="text-3xl font-bold text-primary">
            Task Force Pro
          </Link>
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:text-primary/90 font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
} 