import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createApiHandler } from '../base-handler';

const accountSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['bank', 'credit', 'cash']),
  balance: z.number(),
  currency: z.string().min(1),
});

export const GET = createApiHandler(async (req: NextRequest) => {
  // Forward to backend API
  const response = await fetch(`${process.env.API_URL}/accounts`, {
    headers: {
      'Authorization': `Bearer ${req.headers.get('authorization')}`,
    },
  });

  const data = await response.json();
  return NextResponse.json(data);
});

export const POST = createApiHandler(async (req: NextRequest) => {
  const body = await req.json();
  const validatedData = accountSchema.parse(body);

  // Forward to backend API
  const response = await fetch(`${process.env.API_URL}/accounts`, {
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