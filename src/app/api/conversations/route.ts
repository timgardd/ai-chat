import { NextRequest, NextResponse } from 'next/server';
import { getConversations, createConversation } from '@/db/queries';

export async function GET() {
  const conversations = await getConversations();
  return NextResponse.json(conversations);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const title = body.title || "New Chat";
  
  const conversation = await createConversation(title);
  
  return NextResponse.json(conversation);
}
