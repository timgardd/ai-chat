import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const conversationId = searchParams.get('conversationId');
  
  if (conversationId) {
    const filtered = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(filtered);
  }
  
  return NextResponse.json([]);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const newMessage = await prisma.message.create({
    data: {
      role: body.role,
      content: body.content,
      conversationId: body.conversationId
    }
  });
  
  return NextResponse.json(newMessage);
}
