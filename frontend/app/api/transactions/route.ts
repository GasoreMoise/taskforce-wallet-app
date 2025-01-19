import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createApiHandler } from '../base-handler';

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number(),
  category: z.string().min(1),
  description: z.string().min(1),
  accountId: z.string().min(1),
  date: z.string().min(1),
});

export const GET = createApiHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  
  // Forward to backend API with query params
  const response = await fetch(
    `${process.env.API_URL}/transactions?${searchParams.toString()}`,
    {
      headers: {
        'Authorization': `Bearer ${req.headers.get('authorization')}`,
      },
    }
  );

  const data = await response.json();
  return NextResponse.json(data);
});

export const POST = createApiHandler(async (req: NextRequest) => {
  const body = await req.json();
  const validatedData = transactionSchema.parse(body);

  // Forward to backend API
  const response = await fetch(`${process.env.API_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${req.headers.get('authorization')}`,
    },
    body: JSON.stringify(validatedData),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: 201 });
}); 