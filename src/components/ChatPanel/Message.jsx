import ReactMarkdown from "react-markdown";

const Message = ({ message }) => {
  const isUser = message.role === "user";

  // Do not render empty assistant bubbles (e.g. while waiting for the first chunk to arrive)
  if (!isUser && !message.content) {
    return null;
  }

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-6`}>
      <div
        className={`max-w-[80%] rounded-2xl p-4 ${
          isUser
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-white text-gray-800 shadow-sm border border-gray-200 rounded-bl-none"
        }`}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
        ) : (
          <div className="prose prose-sm prose-blue max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 mt-1">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
