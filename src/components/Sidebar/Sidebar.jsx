"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ConversationItem from "./ConversationItem";
import { getConversations } from "@/api/conversations";

const Sidebar = () => {
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState("");
  const params = useParams();
  const activeId = params?.id;

  useEffect(() => {
    // Strictly fetches exactly once when the sidebar initially mounts
    getConversations()
      .then((data) => {
        console.log("Fetched conversations:", data);
        setConversations(data || []);
      })
      .catch((err) => setError("Fetch Error: " + err.message));
  }, []);

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col border-r border-gray-800">
      <div className="p-4 pt-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-100">AI Chat</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-3">
        {error ? (
           <div className="text-red-400 text-sm p-2 bg-red-900/50 rounded">{error}</div>
        ) : conversations.length === 0 ? (
           <div className="text-gray-500 text-sm p-2">Loading/Empty...</div>
        ) : null}
        <ul className="space-y-1">
          {conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeId}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
