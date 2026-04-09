"use client";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ConversationItem from "./ConversationItem";

const Sidebar = () => {
  const params = useParams();
  const router = useRouter();
  const activeId = params?.id;
  const queryClient = useQueryClient();

  const { data: conversations = [], isLoading, isError } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await fetch("/api/conversations");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    }
  });

  const createChat = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Conversation" }),
      });
      return res.json();
    },
    onSuccess: (newChat) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      router.push(`/c/${newChat.id}`);
    }
  });

  const deleteChat = useMutation({
    mutationFn: async (id) => {
      await fetch(`/api/conversations/${id}`, { method: "DELETE" });
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      if (activeId === deletedId) {
        router.push("/");
      }
    }
  });

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col border-r border-gray-800">
      <div className="p-4 pt-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-100">AI Chat</h2>
        <button 
          onClick={() => createChat.mutate()}
          className="bg-blue-600 hover:bg-blue-500 text-white rounded px-2 py-1 text-sm font-medium transition-colors disabled:opacity-50"
          disabled={createChat.isPending}
        >
          {createChat.isPending ? '...' : '+ New'}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-3">
        {isError && <div className="text-red-400 text-xs p-2">Fetch Error</div>}
        {isLoading && <div className="text-gray-500 text-xs p-2">Loading...</div>}
        <ul className="space-y-1">
          {conversations.map((conv) => (
            <div key={conv.id} className="group flex items-center">
              <div className="flex-1 min-w-0">
                <ConversationItem
                  conversation={conv}
                  isActive={conv.id === activeId}
                />
              </div>
              <button 
                onClick={() => deleteChat.mutate(conv.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 p-2 transition-opacity"
                title="Delete"
                disabled={deleteChat.isPending}
              >
                ✕
              </button>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
