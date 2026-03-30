"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ChatPanel from "@/components/ChatPanel/ChatPanel";
import { getMessages, createMessage } from "@/api/messages";
import { requestLLMResponse } from "@/api/llm";

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params?.id as string;
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Requirement: Messages should be fetched when the active conversation changes
  useEffect(() => {
    let mounted = true;
    if (conversationId) {
      getMessages(conversationId).then(data => {
        if (mounted) setMessages(data);
      });
    }
    return () => { mounted = false; };
  }, [conversationId]); // ONLY runs when strictly conversationId changes

  const handleSendMessage = async (content: string) => {
    if (!conversationId || isLoading) return;

    setIsLoading(true);

    try {
      const userMessage = await createMessage({
        conversationId,
        role: "user",
        content,
      });

      // User message appears in the chat immediately
      setMessages(prev => [...prev, userMessage]);

      const messagesContext = [...messages, userMessage];

      const tempId = `temp-${Date.now()}`;
      setMessages(prev => [...prev, {
        id: tempId,
        conversationId,
        role: "assistant",
        content: ""
      }]);

      let finalContent = "";
      await requestLLMResponse(messagesContext, (chunk: string) => {
        finalContent += chunk;
        setMessages(prev =>
          prev.map(msg =>
            msg.id === tempId ? { ...msg, content: finalContent } : msg
          )
        );
      });

      // Assistant message immediately synchronizes
      const assistantMessage = await createMessage({
        conversationId,
        role: "assistant",
        content: finalContent
      });

      setMessages(prev =>
        prev.map(msg =>
          msg.id === tempId ? assistantMessage : msg
        )
      );

    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatPanel
      messages={messages}
      isLoading={isLoading}
      onSendMessage={handleSendMessage}
    />
  );
}
