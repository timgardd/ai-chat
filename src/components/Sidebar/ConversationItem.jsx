import Link from "next/link";

const ConversationItem = ({ conversation, isActive, onDoubleClick }) => {
  return (
    <li onDoubleClick={onDoubleClick}>
      <Link
        href={`/c/${conversation.id}`}
        className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
          isActive
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-gray-800 hover:text-white"
        }`}
      >
        <div className="truncate font-medium">{conversation.title}</div>
      </Link>
    </li>
  );
};

export default ConversationItem;
