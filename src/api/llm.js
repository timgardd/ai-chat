export const requestLLMResponse = async (messagesContext, onChunk) => {

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messagesArray: messagesContext })
  });

  if (!res.ok || !res.body) {
    throw new Error("Failed to get LLM response from server");
  }


  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    onChunk(chunk);
  }
};
