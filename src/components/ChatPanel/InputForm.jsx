"use client";
import { useState } from "react";

const InputForm = ({ onSend, isLoading }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSend(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 bg-white p-4 flex gap-2">
      <input
        type="text"
        id="chat-input"
        name="chat-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type a message..."
        disabled={isLoading}
        className="flex-1 bg-gray-100 border border-gray-300 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={!inputValue.trim() || isLoading}
        className="bg-blue-600 text-white rounded-full px-6 py-3 font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send
      </button>
    </form>
  );
};

export default InputForm;
