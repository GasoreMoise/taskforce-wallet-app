import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { apiClient } from '@/lib/api/client';
import { authOptions } from '../../auth/[...nextauth]/route';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const response = await apiClient.get(`/categories/${params.id}`, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Category not found' },
      { status: error.response?.status || 404 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const response = await apiClient.patch(`/categories/${params.id}`, body, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to update category' },
      { status: error.response?.status || 500 }
    );
  }
} 