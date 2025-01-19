import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createApiHandler } from '../base-handler';

const categorySchema = z.object({
  name: z.string().min(1),
  type: z.enum(['income', 'expense']),
  color: z.string().optional(),
});

export const GET = createApiHandler(async (req: NextRequest) => {
  const response = await fetch(`${process.env.API_URL}/categories`, {
    headers: {
      'Authorization': `Bearer ${req.headers.get('authorization')}`,
    },
  });

  const data = await response.json();
  return NextResponse.json(data);
});

export const POST = createApiHandler(async (req: NextRequest) => {
  const body = await req.json();
  const validatedData = categorySchema.parse(body);

  const response = await fetch(`${process.env.API_URL}/categories`, {
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