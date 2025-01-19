'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CreateAccountModal } from './CreateAccountModal';

export function CreateAccountButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Add Account
      </Button>
      <CreateAccountModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
} 