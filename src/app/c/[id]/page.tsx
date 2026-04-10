export const dynamic = "force-dynamic";
import { getConversationMessages } from "@/db/queries";
import ChatClient from "./ChatClient";

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const messages = await getConversationMessages(id);

  return <ChatClient conversationId={id} initialMessages={messages} />;
}
