import ConversationItem from "./ConversationItem";

const Sidebar = ({ conversations, activeId, onSelect }) => {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col border-r border-gray-800">
      <div className="p-4 pt-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-100">AI Chat</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeId}
              onClick={() => onSelect(conv.id)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
