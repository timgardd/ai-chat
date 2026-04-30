export const dynamic = "force-dynamic";
import { getConversations } from "@/db/queries";
import SidebarClient from "./SidebarClient";

export default async function Sidebar() {
  const conversations = await getConversations();

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col border-r border-gray-800">
      <SidebarClient initialConversations={conversations} />
    </div>
  );
}
