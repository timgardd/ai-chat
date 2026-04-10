import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createMessage, ensureConversation } from '@/db/queries';

const MODEL = 'openai/gpt-4o-mini';

function extractText(msg: any): string {
  if (msg.parts && Array.isArray(msg.parts)) {
    return msg.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('');
  }
  if (typeof msg.content === 'string') return msg.content;
  if (Array.isArray(msg.content)) {
    return msg.content.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('');
  }
  return String(msg.content || '');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const conversationId = body.id as string;
    const messages: any[] = body.messages ?? [];

    if (!conversationId) return new Response('Missing conversationId', { status: 400 });

    const latestMessage = messages[messages.length - 1];
    if (!latestMessage) return new Response('No messages provided', { status: 400 });

    const userText = extractText(latestMessage);

    await ensureConversation(conversationId, userText.slice(0, 50) || 'New Chat');

    if (userText) {
      await createMessage({ role: 'user', content: userText, conversationId });
    }

    const modelMessages = messages.map((m: any) => ({
      role: m.role as 'user' | 'assistant',
      content: extractText(m) || ' ',
    }));

    const client = createOpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY || '',
      compatibility: 'compatible',
    });

    const result = streamText({
      model: client.chat(MODEL),
      system: 'You are a helpful, friendly AI assistant. Answer questions clearly and concisely. Be conversational and engaging.',
      messages: modelMessages,
      async onFinish({ text }) {
        if (text) {
          await createMessage({ role: 'assistant', content: text, conversationId });
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (e: any) {
    return new Response(e.message || 'Internal Server Error', { status: 500 });
  }
}
