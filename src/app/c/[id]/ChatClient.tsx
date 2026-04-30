"use client";

import { useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import ChatPanel from "@/components/ChatPanel/ChatPanel";

export default function ChatClient({
  conversationId,
  initialMessages,
}: {
  conversationId: string;
  initialMessages: any[];
}) {
  const { messages, setMessages, sendMessage, status, error } = useChat({
    id: conversationId,
    body: { id: conversationId },
    initialMessages,
  } as any);

  useEffect(() => {
    if (messages.length === 0 && initialMessages.length > 0) {
      setMessages(initialMessages);
    }
  }, [conversationId]);

  const isLoading = status === 'streaming' || status === 'submitted';

  return (
    <div className="flex flex-col h-full w-full relative">
      <ChatPanel
        messages={messages || []}
        isLoading={isLoading}
        sendMessage={sendMessage}
      />
      {error && (
        <div className="absolute bottom-24 p-3 bg-red-100/90 text-red-700 w-full text-center text-sm font-semibold shadow-lg">
          Error: {error.message || "API error."}
        </div>
      )}
    </div>
  );
}
