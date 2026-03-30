export const requestLLMResponse = async (messagesContext, onChunk) => {
  // Call the Next.js local API route instead of OpenRouter directly!
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messagesArray: messagesContext })
  });

  if (!res.ok || !res.body) {
    throw new Error("Failed to get LLM response from server");
  }

  // Next.js server intelligently unwraps the SSE JSON payload,
  // we just stream the pure UTF-8 text strings native to the browser reader!
  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    onChunk(chunk);
  }
};
