'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { apiClient } from '@/lib/api/client';
import React from 'react';

export function ReportGenerator() {
  const [reportType, setReportType] = useState<string>('monthly');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);
      try {
        const response = await apiClient.get(`/reports/generate/${reportType}`, {
          responseType: 'blob',
        });
        
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${reportType}-report.pdf`);
        
        // Append to html link element page
        document.body.appendChild(link);
        
        // Start download
        link.click();
        
        // Clean up and remove the link
        link.parentNode?.removeChild(link);
      } finally {
        setIsGenerating(false);
      }
    },
  });

  return (
    <div className="flex items-center space-x-4">
      <Select
        value={reportType}
        onValueChange={setReportType}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select report type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="monthly">Monthly Report</SelectItem>
          <SelectItem value="quarterly">Quarterly Report</SelectItem>
          <SelectItem value="yearly">Yearly Report</SelectItem>
        </SelectContent>
      </Select>

      <Button
        onClick={() => generateReport.mutate()}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        Generate Report
      </Button>
    </div>
  );
} 