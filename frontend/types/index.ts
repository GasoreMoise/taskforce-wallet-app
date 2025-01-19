export interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
  }
  
  export interface Account {
    id: string;
    name: string;
    type: 'bank' | 'credit' | 'cash';
    balance: number;
    currency: string;
    lastUpdated: string;
  }
  
  export interface Transaction {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
    date: string;
    accountId: string;
    account?: Account;
  }
  
  export interface Budget {
    id: string;
    category: string;
    amount: number;
    spent: number;
    period: 'monthly' | 'yearly';
    startDate: string;
    endDate: string;
  }
  
  export interface Report {
    id: string;
    type: string;
    dateRange: {
      start: string;
      end: string;
    };
    data: any; // Specific to report type
    createdAt: string;
  }
  
  export type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';
  
  export interface ApiResponse<T> {
    data: T;
    meta?: {
      total?: number;
      page?: number;
      limit?: number;
    };
  }
  
  export interface ApiError {
    message: string;
    code?: string;
    details?: any;
  }