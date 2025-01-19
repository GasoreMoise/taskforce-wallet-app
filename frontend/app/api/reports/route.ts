import { NextRequest, NextResponse } from 'next/server';
import { createApiHandler } from '../base-handler';

export const GET = createApiHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'monthly';
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  // Forward to backend API
  const response = await fetch(
    `${process.env.API_URL}/reports?type=${type}&startDate=${startDate}&endDate=${endDate}`,
    {
      headers: {
        'Authorization': `Bearer ${req.headers.get('authorization')}`,
      },
    }
  );

  const data = await response.json();
  return NextResponse.json(data);
});

export const GET_CHARTS = createApiHandler(async (req: NextRequest) => {
  // Forward to backend API
  const response = await fetch(`${process.env.API_URL}/reports/charts`, {
    headers: {
      'Authorization': `Bearer ${req.headers.get('authorization')}`,
    },
  });

  const data = await response.json();
  return NextResponse.json(data);
}); 