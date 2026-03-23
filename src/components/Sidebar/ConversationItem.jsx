const ConversationItem = ({ conversation, isActive, onClick }) => {
  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
          isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"
        }`}
      >
        <span className="block truncate">{conversation.title}</span>
      </button>
    </li>
  );
};

export default ConversationItem;
