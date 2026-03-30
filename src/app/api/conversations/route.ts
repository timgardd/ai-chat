import { NextResponse } from 'next/server';

const conversations = [
  { id: '1', title: 'Great Sci-Fi Movies', date: new Date().toISOString() },
  { id: '2', title: 'Football Highlights', date: new Date().toISOString() }
];

export async function GET() {
  return NextResponse.json(conversations);
}
