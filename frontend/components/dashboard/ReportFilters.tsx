'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
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
import React from 'react';

export function ReportFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [dateRange, setDateRange] = useState<'custom' | 'month' | 'quarter' | 'year'>(
    (searchParams.get('range') as any) || 'month'
  );
  const [startDate, setStartDate] = useState<Date | undefined>(
    searchParams.get('start') ? new Date(searchParams.get('start')!) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    searchParams.get('end') ? new Date(searchParams.get('end')!) : undefined
  );

  const applyFilters = () => {
    const params = new URLSearchParams();
    params.set('range', dateRange);
    if (startDate) params.set('start', format(startDate, 'yyyy-MM-dd'));
    if (endDate) params.set('end', format(endDate, 'yyyy-MM-dd'));

    router.push(`/reports?${params.toString()}`);
  };

  const resetFilters = () => {
    setDateRange('month');
    setStartDate(undefined);
    setEndDate(undefined);
    router.push('/reports');
  };

  return (
    <div className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger>
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>

        {dateRange === 'custom' && (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'PPP') : <span>Start date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'PPP') : <span>End date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={resetFilters}>
          Reset
        </Button>
        <Button onClick={applyFilters}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
} 