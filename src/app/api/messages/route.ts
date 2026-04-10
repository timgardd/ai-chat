import { NextRequest, NextResponse } from 'next/server';
import { getConversationMessages, createMessage } from '@/db/queries';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const conversationId = searchParams.get('conversationId');
  
  if (conversationId) {
    const filtered = await getConversationMessages(conversationId);
    return NextResponse.json(filtered);
  }
  
  return NextResponse.json([]);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const newMessage = await createMessage({
    role: body.role,
    content: body.content,
    conversationId: body.conversationId
  });
  
  return NextResponse.json(newMessage);
}
