import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createMessage, ensureConversation, getConversationMessages } from '@/db/queries';

const MODEL = 'openai/gpt-4o-mini';

export async function POST(req: Request) {
  try {
    const { messages, id: conversationId } = await req.json();

    if (!conversationId) return new Response('Missing conversationId', { status: 400 });

    const userMessage = messages.at(-1);
    if (!userMessage) return new Response('No messages provided', { status: 400 });

    const userText = userMessage.parts
      ? userMessage.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('')
      : userMessage.content ?? '';

    await ensureConversation(conversationId, userText.slice(0, 50) || 'New Chat');

    await createMessage({ role: 'user', content: userText, conversationId });

    const history = await getConversationMessages(conversationId);

    const client = createOpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY || '',
      compatibility: 'compatible',
    });

    const result = streamText({
      model: client.chat(MODEL),
      system: 'You are a helpful, friendly AI assistant. Answer questions clearly and concisely.',
      messages: history.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
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
