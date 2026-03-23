import { useEffect, useRef } from "react";
import Message from "./Message";
import InputForm from "./InputForm";
import LoadingIndicator from "./LoadingIndicator";

const ChatPanel = ({ messages, isLoading, onSendMessage }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // The AI is "Thinking" (waiting for the very first chunk)
  // if isLoading is true, and the last message in the array is an EMPTY assistant message.
  const lastMessage = messages[messages.length - 1];
  const isWaitingForAIChunk =
    isLoading && lastMessage && lastMessage.role === "assistant" && !lastMessage.content;

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

        {/* Only show the loading bouncy dots BEFORE the text starts writing */}
        {isWaitingForAIChunk && <LoadingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      <InputForm onSend={onSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatPanel;
