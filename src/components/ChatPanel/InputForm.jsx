"use client";
import { useState } from "react";

const InputForm = ({ isLoading, sendMessage }) => {
  const [text, setText] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    setText("");
    await sendMessage({ role: "user", content: trimmed });
  };

  return (
    <form onSubmit={handleSend} className="border-t border-gray-200 bg-white p-4 flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            handleSend(e);
          }
        }}
        placeholder="Type a message..."
        disabled={isLoading}
        autoFocus
        className="flex-1 bg-gray-100 border border-gray-300 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={!text.trim() || isLoading}
        className="bg-blue-600 text-white rounded-full px-6 py-3 font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "..." : "Send"}
      </button>
    </form>
  );
};

export default InputForm;
