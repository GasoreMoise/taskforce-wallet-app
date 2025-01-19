'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-xl">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <motion.main 
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-6 lg:p-8 pt-6"
        >
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
} 