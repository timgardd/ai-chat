export const dynamic = "force-dynamic";
import { getConversationMessages } from "@/db/queries";
import ChatClient from "./ChatClient";

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dbMessages = await getConversationMessages(id);

  const initialMessages = dbMessages.map((m) => ({
    id: m.id,
    role: m.role as "user" | "assistant",
    content: m.content,
    parts: [{ type: "text" as const, text: m.content }],
  }));

  return <ChatClient key={id} conversationId={id} initialMessages={initialMessages} />;
}
