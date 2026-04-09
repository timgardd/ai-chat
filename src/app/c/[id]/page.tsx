"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ChatPanel from "@/components/ChatPanel/ChatPanel";
import { requestLLMResponse } from "@/api/llm";

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params?.id as string;
  const queryClient = useQueryClient();
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamContent, setStreamContent] = useState("");

  const { data: messages = [], isLoading: isFetching } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      const res = await fetch(`/api/messages?conversationId=${conversationId}`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
    enabled: !!conversationId
  });

  const saveMessage = useMutation({
    mutationFn: async (msgData: any) => {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msgData),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
    }
  });

  const handleSendMessage = async (content: string) => {
    if (!conversationId || isStreaming) return;

    setIsStreaming(true);
    setStreamContent("");

    try {
      const userMessage = await saveMessage.mutateAsync({
        conversationId,
        role: "user",
        content,
      });

      const currentMessages = queryClient.getQueryData<any[]>(['messages', conversationId]) || [];
      const messagesContext = [...currentMessages.filter(m => m.id !== userMessage.id), userMessage];

      let finalContent = "";
      
      await requestLLMResponse(messagesContext, (chunk: string) => {
        finalContent += chunk;
        setStreamContent(finalContent);
      });

      await saveMessage.mutateAsync({
        conversationId,
        role: "assistant",
        content: finalContent
      });

    } catch (error) {
      console.error("Failed to process conversation stream:", error);
    } finally {
      setIsStreaming(false);
      setStreamContent("");
    }
  };

  const displayMessages = [...messages];
  if (isStreaming) {
    displayMessages.push({
      id: "temp-stream",
      conversationId,
      role: "assistant",
      content: streamContent
    });
  }

  return (
    <ChatPanel
      messages={displayMessages}
      isLoading={isFetching || isStreaming}
      onSendMessage={handleSendMessage}
    />
  );
}
