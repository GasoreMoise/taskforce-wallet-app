export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    meta: {
      total: number;
      page: number;
      limit: number;
    };
  } 