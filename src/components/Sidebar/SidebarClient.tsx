"use client";

import { useOptimistic, useTransition, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { addChatAction, removeChatAction, renameChatAction } from "@/app/actions";
import ConversationItem from "./ConversationItem";

export default function SidebarClient({ initialConversations }: { initialConversations: any[] }) {
  const router = useRouter();
  const params = useParams();
  const activeId = params?.id;
  const [isPending, startTransition] = useTransition();

  const [optimisticConversations, addOptimisticAction] = useOptimistic(
    initialConversations,
    (state, action: { type: "add" | "remove"; payload: any }) => {
      if (action.type === "add") {
        return [action.payload, ...state];
      } else if (action.type === "remove") {
        return state.filter((c) => c.id !== action.payload.id);
      } else if (action.type === "rename") {
        return state.map((c) => 
          c.id === action.payload.id ? { ...c, title: action.payload.title } : c
        );
      }
      return state;
    }
  );

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleCreateChat = () => {
    const tempId = `temp-${Date.now()}`;
    const newChat = { id: tempId, title: "New Conversation", createdAt: new Date() };

    startTransition(async () => {
      addOptimisticAction({ type: "add", payload: newChat });
      const chat = await addChatAction("New Conversation");
      router.push(`/c/${chat.id}`);
    });
  };

  const handleDeleteChat = (id: string) => {
    startTransition(async () => {
      addOptimisticAction({ type: "remove", payload: { id } });
      await removeChatAction(id);
      if (activeId === id) {
        router.push("/");
      }
    });
  };

  const handleRenameSubmit = (id: string) => {
    if (!editTitle.trim()) {
      setEditingId(null);
      return;
    }
    startTransition(async () => {
      addOptimisticAction({ type: "rename", payload: { id, title: editTitle } });
      await renameChatAction(id, editTitle);
      setEditingId(null);
    });
  };

  return (
    <>
      <div className="p-4 pt-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-100">AI Chat</h2>
        <button 
          onClick={handleCreateChat}
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-500 text-white rounded px-2 py-1 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {isPending ? '...' : '+ New'}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-3">
        <ul className="space-y-1">
          {optimisticConversations.map((conv) => (
            <div key={conv.id} className="group flex items-center">
              <div className="flex-1 min-w-0">
                {editingId === conv.id ? (
                  <div className="px-2 py-1">
                    <input
                      autoFocus
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={() => handleRenameSubmit(conv.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRenameSubmit(conv.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      className="w-full bg-gray-800 text-white px-2 py-1 rounded outline-none text-sm border border-blue-500"
                    />
                  </div>
                ) : (
                  <ConversationItem
                    conversation={conv}
                    isActive={conv.id === activeId}
                    onDoubleClick={() => {
                      setEditingId(conv.id);
                      setEditTitle(conv.title);
                    }}
                  />
                )}
              </div>
              {editingId !== conv.id && (
                <div className="opacity-0 group-hover:opacity-100 flex items-center transition-opacity">
                  <button 
                    onClick={() => {
                      setEditingId(conv.id);
                      setEditTitle(conv.title);
                    }}
                    disabled={isPending}
                    className="text-gray-400 hover:text-blue-400 p-1 mr-1 disabled:opacity-0"
                    title="Rename"
                  >
                    ✎
                  </button>
                  <button 
                    onClick={() => handleDeleteChat(conv.id)}
                    disabled={isPending}
                    className="text-gray-400 hover:text-red-400 p-1 mr-2 disabled:opacity-0"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          ))}
        </ul>
      </div>
    </>
  );
}
