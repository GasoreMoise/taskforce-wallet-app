'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

interface ModalProps {
  open: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, onOpenChange, children, className }: ModalProps) {
  const handleClose = () => {
    onClose?.();
    onOpenChange?.(false);
  };

  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={handleClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={cn(
                  'w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all',
                  className
                )}
              >
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export function ModalContent({ children }: { children: React.ReactNode }) {
  return <div className="relative">{children}</div>;
}

export function ModalHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

export function ModalTitle({ children }: { children: React.ReactNode }) {
  return (
    <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
      {children}
    </Dialog.Title>
  );
}

export function ModalDescription({ children }: { children: React.ReactNode }) {
  return (
    <Dialog.Description className="mt-2 text-sm text-gray-500 dark:text-gray-400">
      {children}
    </Dialog.Description>
  );
}

export function ModalFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 flex justify-end space-x-2">
      {children}
    </div>
  );
}

export function ModalCloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </button>
  );
} 