import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]/route';

export function createApiHandler(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async function (req: NextRequest) {
    try {
      const session = await getServerSession(authOptions);

      if (!session) {
        return new NextResponse('Unauthorized', { status: 401 });
      }

      return await handler(req);
    } catch (error) {
      console.error('API Error:', error);
      return new NextResponse(
        'Internal Server Error',
        { status: 500 }
      );
    }
  };
} 