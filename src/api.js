// TODO: Insert your real OpenRouter API key here before testing!
const API_KEY = "Please insert your API key here";

export async function streamChat(messages, onChunkCallback) {
  const payload = {
    model: "openrouter/auto",
    messages: messages,
    stream: true,
  };

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`\nStatus ${response.status}: ${errText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        const chunkStr = decoder.decode(value, { stream: true });
        const lines = chunkStr.split("\n");
        for (const line of lines) {
          if (line.startsWith("data:") && line.trim() !== "data: [DONE]") {
            const dataStr = line.replace("data:", "").trim();
            if (!dataStr) continue;
            try {
              const parsed = JSON.parse(dataStr);
              const contentChunk = parsed.choices[0]?.delta?.content;
              if (contentChunk) {
                onChunkCallback(contentChunk);
              }
            } catch (err) {
              console.error("Error parsing JSON chunk", err, dataStr);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Fetch streaming error:", error);
    onChunkCallback(`\n[API Error: ${error.message}]`);
  }
}
