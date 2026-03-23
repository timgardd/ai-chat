import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import ChatPanel from "./components/ChatPanel/ChatPanel";
import { getConversations } from "./api/conversations";
import { getMessages, createMessage } from "./api/messages";
import { requestLLMResponse } from "./api/llm";

function App() {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch list of conversations strictly on mount
  useEffect(() => {
    let mounted = true;
    getConversations().then((data) => {
      if (mounted) {
        setConversations(data);
        setActiveConversationId((prev) => prev || (data.length > 0 ? data[0].id : null));
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch messages when active conversation changes
  useEffect(() => {
    let mounted = true;
    if (activeConversationId) {
      getMessages(activeConversationId).then((data) => {
        if (mounted) {
          setMessages(data);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [activeConversationId]);

  const handleSendMessage = async (content) => {
    if (!activeConversationId || isLoading) return;

    setIsLoading(true);

    try {
      // 1. Send User message to mock DB
      const userMessage = await createMessage({
        conversationId: activeConversationId,
        role: "user",
        content,
      });

      // 2. Add user message to state
      setMessages((prev) => [...prev, userMessage]);

      // 3. Prepare the conversation context for LLM
      // including the newly created user message
      const messagesContext = [...messages, userMessage];

      // 4. Create a temporary assistant message in state for streaming
      const tempId = `temp-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: tempId,
          conversationId: activeConversationId,
          role: "assistant",
          content: "",
        },
      ]);

      // 5. Stream the response
      let finalContent = "";
      await requestLLMResponse(messagesContext, (chunk) => {
        finalContent += chunk;
        setMessages((prev) =>
          prev.map((msg) => (msg.id === tempId ? { ...msg, content: finalContent } : msg)),
        );
      });

      // 6. Save final assistant message to mock DB and replace temp
      const assistantMessage = await createMessage({
        conversationId: activeConversationId,
        role: "assistant",
        content: finalContent,
      });

      setMessages((prev) => prev.map((msg) => (msg.id === tempId ? assistantMessage : msg)));
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      // Stop loading indicator only after the AI completely finishes answering or crashes
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden text-gray-800">
      <Sidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={setActiveConversationId}
      />
      <ChatPanel messages={messages} isLoading={isLoading} onSendMessage={handleSendMessage} />
    </div>
  );
}

export default App;
