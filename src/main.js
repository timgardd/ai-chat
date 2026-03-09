import { appendUserMessage, createAssistantMessage } from "./chat.js";
import { streamChat } from "./api.js";

const messagesHistory = [];

const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");

async function handleSendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  // 1. Read input, clear field, append user message to DOM
  messageInput.value = "";
  appendUserMessage(text);

  // 2. Add to messages array history
  messagesHistory.push({ role: "user", content: text });

  // 3. Create empty assistant message bubble
  const assistantBubble = createAssistantMessage();

  // 4. Send API request and stream response
  let fullAssistantResponse = "";

  // Disable input while streaming
  messageInput.disabled = true;
  sendBtn.disabled = true;

  await streamChat(messagesHistory, (chunk) => {
    fullAssistantResponse += chunk;
    assistantBubble.appendChunk(chunk);
  });

  // 5. On stream finish, push complete assistant response to history
  messagesHistory.push({ role: "assistant", content: fullAssistantResponse });

  // Re-enable input
  messageInput.disabled = false;
  sendBtn.disabled = false;
  messageInput.focus();
}

sendBtn.addEventListener("click", handleSendMessage);

messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    handleSendMessage();
  }
});
