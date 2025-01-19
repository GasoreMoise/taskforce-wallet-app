'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar as CalendarIcon, Search } from 'lucide-react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/Calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';
import { useTransactionsStore } from '@/lib/store/transactions-store';
import { useCategories } from '@/lib/hooks/useCategories';
import { useAccounts } from '@/lib/hooks/useAccounts';
import React from 'react';

export function AdvancedSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filters, setFilters, resetFilters } = useTransactionsStore();
  const { data: categoriesData } = useCategories();
  const { data: accountsData } = useAccounts();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const urlFilters = {
      search: params.get('search') || '',
      type: (params.get('type') as 'all' | 'income' | 'expense') || 'all',
      category: params.get('category') || null,
      accountId: params.get('accountId') || null,
      startDate: params.get('startDate') ? new Date(params.get('startDate')!) : null,
      endDate: params.get('endDate') ? new Date(params.get('endDate')!) : null,
    };
    setFilters(urlFilters);
  }, [searchParams, setFilters]);

  const updateUrl = (newFilters: typeof filters) => {
    const params = new URLSearchParams();
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.type !== 'all') params.set('type', newFilters.type);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.accountId) params.set('accountId', newFilters.accountId);
    if (newFilters.startDate) params.set('startDate', newFilters.startDate.toISOString());
    if (newFilters.endDate) params.set('endDate', newFilters.endDate.toISOString());
    
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search transactions..."
          value={filters.search}
          onChange={(e) => {
            const newFilters = { ...filters, search: e.target.value };
            setFilters(newFilters);
            updateUrl(newFilters);
          }}
          className="max-w-sm"
        />
        
        <Select
          value={filters.type}
          onValueChange={(value: typeof filters.type) => {
            const newFilters = { ...filters, type: value };
            setFilters(newFilters);
            updateUrl(newFilters);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.startDate ? (
                filters.endDate ? (
                  <>
                    {format(filters.startDate, 'LLL dd, y')} -{' '}
                    {format(filters.endDate, 'LLL dd, y')}
                  </>
                ) : (
                  format(filters.startDate, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              selected={{
                from: filters.startDate || undefined,
                to: filters.endDate || undefined,
              }}
              onSelect={(range) => {
                const newFilters = {
                  ...filters,
                  startDate: range?.from || null,
                  endDate: range?.to || null,
                };
                setFilters(newFilters);
                updateUrl(newFilters);
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          onClick={() => {
            resetFilters();
            router.push('?');
          }}
        >
          Reset
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={filters.category || ''}
          onValueChange={(value) => {
            const newFilters = { ...filters, category: value || null };
            setFilters(newFilters);
            updateUrl(newFilters);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categoriesData?.data.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.accountId || ''}
          onValueChange={(value) => {
            const newFilters = { ...filters, accountId: value || null };
            setFilters(newFilters);
            updateUrl(newFilters);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Account" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Accounts</SelectItem>
            {accountsData?.data.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 