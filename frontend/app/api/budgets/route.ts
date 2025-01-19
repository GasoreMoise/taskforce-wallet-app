import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createApiHandler } from '../base-handler';

const budgetSchema = z.object({
  category: z.string().min(1),
  amount: z.number(),
  period: z.enum(['monthly', 'yearly']),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
});

export const GET = createApiHandler(async (req: NextRequest) => {
  // Forward to backend API
  const response = await fetch(`${process.env.API_URL}/budgets`, {
    headers: {
      'Authorization': `Bearer ${req.headers.get('authorization')}`,
    },
  });

  const data = await response.json();
  return NextResponse.json(data);
});

export const POST = createApiHandler(async (req: NextRequest) => {
  const body = await req.json();
  const validatedData = budgetSchema.parse(body);

  // Forward to backend API
  const response = await fetch(`${process.env.API_URL}/budgets`, {
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