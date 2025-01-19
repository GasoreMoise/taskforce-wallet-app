import { NextResponse } from 'next/server';
import { apiClient } from '@/lib/api/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await apiClient.post('/auth/register', body);

    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Registration failed' },
      { status: error.response?.status || 500 }
    );
  }
} 