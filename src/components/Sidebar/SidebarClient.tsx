"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addChatAction, removeChatAction, renameChatAction } from "@/app/actions";
import ConversationItem from "./ConversationItem";

export default function SidebarClient({ initialConversations }: { initialConversations: any[] }) {
  const router = useRouter();
  const params = useParams();
  const activeId = params?.id;
  const queryClient = useQueryClient();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const { data: conversations } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => fetch("/api/conversations").then((r) => r.json()),
    initialData: initialConversations,
  });

  const addMutation = useMutation({
    mutationFn: (title: string) => addChatAction(title),
    onMutate: async (title) => {
      await queryClient.cancelQueries({ queryKey: ["conversations"] });
      const previous = queryClient.getQueryData(["conversations"]);
      queryClient.setQueryData(["conversations"], (old: any[]) => [
        { id: `temp-${Date.now()}`, title, createdAt: new Date() },
        ...(old || []),
      ]);
      return { previous };
    },
    onError: (err, vars, context: any) => {
      queryClient.setQueryData(["conversations"], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onSuccess: (chat) => {
      router.push(`/c/${chat.id}`);
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => removeChatAction(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["conversations"] });
      const previous = queryClient.getQueryData(["conversations"]);
      queryClient.setQueryData(["conversations"], (old: any[]) =>
        (old || []).filter((c) => c.id !== id)
      );
      return { previous };
    },
    onError: (err, vars, context: any) => {
      queryClient.setQueryData(["conversations"], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const renameMutation = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      renameChatAction(id, title),
    onMutate: async ({ id, title }) => {
      await queryClient.cancelQueries({ queryKey: ["conversations"] });
      const previous = queryClient.getQueryData(["conversations"]);
      queryClient.setQueryData(["conversations"], (old: any[]) =>
        (old || []).map((c) => (c.id === id ? { ...c, title } : c))
      );
      return { previous };
    },
    onError: (err, vars, context: any) => {
      queryClient.setQueryData(["conversations"], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const handleCreateChat = () => {
    addMutation.mutate("New Conversation");
  };

  const handleDeleteChat = (id: string) => {
    removeMutation.mutate(id);
    if (activeId === id) {
      router.push("/");
    }
  };

  const handleRenameSubmit = (id: string) => {
    if (!editTitle.trim()) {
      setEditingId(null);
      return;
    }
    renameMutation.mutate({ id, title: editTitle });
    setEditingId(null);
  };

  const isPending =
    addMutation.isPending || removeMutation.isPending || renameMutation.isPending;

  return (
    <>
      <div className="p-4 pt-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-100">AI Chat</h2>
        <button
          onClick={handleCreateChat}
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-500 text-white rounded px-2 py-1 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {isPending ? "..." : "+ New"}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-3">
        <ul className="space-y-1">
          {(conversations || []).map((conv: any) => (
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
