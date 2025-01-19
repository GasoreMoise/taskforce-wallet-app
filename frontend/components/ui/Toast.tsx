'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
}

export function Toast({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-2 shadow-lg',
        {
          'bg-green-500 text-white': type === 'success',
          'bg-red-500 text-white': type === 'error',
          'bg-blue-500 text-white': type === 'info',
        }
      )}
    >
      <p className="text-sm">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className="rounded-full p-1 hover:bg-white/10"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
} 