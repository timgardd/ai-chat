export const dynamic = "force-dynamic";
import { getConversations } from "@/db/queries";
import SidebarClient from "./SidebarClient";

export default async function Sidebar() {
  const conversations = await getConversations();

  return (
    <div className="w-full md:w-64 h-1/3 md:h-full shrink-0 bg-gray-900 text-white flex flex-col border-b md:border-b-0 md:border-r border-gray-800">
      <SidebarClient initialConversations={conversations} />
    </div>
  );
}
