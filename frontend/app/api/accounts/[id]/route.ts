import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { apiClient } from '@/lib/api/client';
import { Session } from 'next-auth';

interface ExtendedSession extends Session {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    accessToken?: string;
  };
}
import { authOptions } from '../../auth/[...nextauth]/route';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession;

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const response = await apiClient.get(`/accounts/${params.id}`, {
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken || ''}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Account not found' },
      { status: error.response?.status || 404 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession;

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const response = await apiClient.patch(`/accounts/${params.id}`, body, {
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken || ''}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to update account' },
      { status: error.response?.status || 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession;

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await apiClient.delete(`/accounts/${params.id}`, {
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken || ''}`,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to delete account' },
      { status: error.response?.status || 500 }
    );
  }
} 