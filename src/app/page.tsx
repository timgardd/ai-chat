export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to AI Chat!</h1>
      <p className="text-gray-500 max-w-md">
        Select a conversation from the sidebar to continue, or observe the routing change when you chat.
      </p>
    </div>
  );
}
