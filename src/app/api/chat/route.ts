import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { messagesArray } = body;
  const apiKey = process.env.OPENROUTER_API_KEY || "YOUR_API_KEY_HERE";

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Next.js Web Chat",
      },
      body: JSON.stringify({
          model: "openrouter/free",
          messages: messagesArray.map((m: any) => ({ role: m.role, content: m.content })),
          stream: true,
      }),
  });

  const stream = new ReadableStream({
    async start(controller) {
      if (!response.body) {
        controller.close();
        return;
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      const encoder = new TextEncoder();

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
                // Yield purely the text content chunk, keeping the browser logic extremely simple and safe
                controller.enqueue(encoder.encode(data.choices[0].delta.content));
              }
            } catch (e) {}
          }
        }
      }
      controller.close();
    }
  });

  return new NextResponse(stream);
}
