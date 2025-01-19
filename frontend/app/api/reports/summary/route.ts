import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { apiClient } from '@/lib/api/client';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const [summaryResponse, trendResponse] = await Promise.all([
      apiClient.get('/reports/summary', {
        params: Object.fromEntries(searchParams),
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      }),
      apiClient.get('/reports/trends', {
        params: Object.fromEntries(searchParams),
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      }),
    ]);

    return NextResponse.json({
      summary: summaryResponse.data,
      trends: trendResponse.data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to fetch summary' },
      { status: error.response?.status || 500 }
    );
  }
} 