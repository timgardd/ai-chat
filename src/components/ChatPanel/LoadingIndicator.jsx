const LoadingIndicator = () => {
  return (
    <div className="flex justify-start mb-6">
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl rounded-bl-none p-4 flex items-center space-x-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
