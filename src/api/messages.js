export const getMessages = async (conversationId) => {
  const res = await fetch(`/api/messages?conversationId=${conversationId}`);
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
};

export const createMessage = async (message) => {
  const res = await fetch("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message)
  });
  if (!res.ok) throw new Error("Failed to create message");
  return res.json();
};
