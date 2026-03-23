export const requestLLMResponse = async (messagesArray, onChunk) => {
  // IMPORTANT: Insert your OpenRouter API Key here
  const apiKey = "YOUR_API_KEY_HERE";

  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
    console.warn("Please set your OpenRouter API key in src/api/llm.js");
    const mockText =
      "Please configure your OpenRouter API key in src/api/llm.js to see real responses.";
    const chunks = mockText.split(" ");
    for (const chunk of chunks) {
      await new Promise((r) => setTimeout(r, 50));
      onChunk(chunk + " ");
    }
    return;
  }

  // "openrouter/free" auto-routes to whatever free model is currently online and functioning
  const modelToUse = "openrouter/free";

  console.log("Using Free OpenRouter Auto-Router:", modelToUse);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      // Free models often require HTTP-Referer and X-Title headers to prevent blocking
      "HTTP-Referer": "http://localhost:5173",
      "X-Title": "React Chat App",
    },
    body: JSON.stringify({
      model: modelToUse,
      messages: messagesArray.map((m) => ({ role: m.role, content: m.content })),
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} when trying to use model ${modelToUse}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (line.startsWith("data:")) {
        const dataStr = line.replace("data:", "").trim();
        if (dataStr === "[DONE]") continue;
        if (!dataStr) continue;

        try {
          const data = JSON.parse(dataStr);
          if (data.choices && data.choices[0].delta && data.choices[0].delta.content) {
            onChunk(data.choices[0].delta.content);
          }
        } catch (e) {
          console.error("Error parsing JSON chunk from OpenRouter:", e, dataStr);
        }
      }
    }
  }
};
