import { NextRequest, NextResponse } from 'next/server';

// Server-side in-memory mock database
let messages = [
  { id: 'm1', conversationId: '1', role: 'user', content: 'What are some must-watch sci-fi movies?' },
  { id: 'm2', conversationId: '1', role: 'assistant', content: 'You should definitely check out Interstellar, The Matrix, and Blade Runner 2049. They are absolute classics!' },
  { id: 'm3', conversationId: '2', role: 'user', content: 'Who won the Champions League last year?' },
  { id: 'm4', conversationId: '2', role: 'assistant', content: 'Real Madrid won the Champions League last year, defeating Borussia Dortmund in the final.' }
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const conversationId = searchParams.get('conversationId');
  
  if (conversationId) {
    const filtered = messages.filter(m => m.conversationId === conversationId);
    return NextResponse.json(filtered);
  }
  
  return NextResponse.json(messages);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const newMessage = { 
    ...body, 
    id: Date.now().toString() 
  };
  messages.push(newMessage);
  return NextResponse.json(newMessage);
}
