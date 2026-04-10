"use client";
import { useEffect, useRef } from "react";
import Message from "./Message";
import InputForm from "./InputForm";
import LoadingIndicator from "./LoadingIndicator";

const ChatPanel = ({ messages, isLoading, sendMessage }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const lastMessage = messages[messages.length - 1];
  
  function hasText(msg) {
    if (!msg) return false;
    if (msg.parts && Array.isArray(msg.parts)) {
      if (msg.parts.some(p => p.type === 'text' && p.text)) return true;
    }
    return !!msg.content;
  }

  const isWaitingForAIChunk =
    isLoading && (!lastMessage || lastMessage.role === "user" || !hasText(lastMessage));

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full">
      <div className="flex-1 p-6 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            Send a message to start the conversation
          </div>
        ) : (
          messages.map((msg) => <Message key={msg.id} message={msg} />)
        )}
        {isWaitingForAIChunk && <LoadingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      <InputForm isLoading={isLoading} sendMessage={sendMessage} />
    </div>
  );
};

export default ChatPanel;
