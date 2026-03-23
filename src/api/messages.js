let messages = [
  {
    id: "m1",
    conversationId: "1",
    role: "user",
    content: "What are some must-watch sci-fi movies?",
  },
  {
    id: "m2",
    conversationId: "1",
    role: "assistant",
    content:
      "You should definitely check out Interstellar, The Matrix, and Blade Runner 2049. They are absolute classics!",
  },
  {
    id: "m3",
    conversationId: "2",
    role: "user",
    content: "Who won the Champions League last year?",
  },
  {
    id: "m4",
    conversationId: "2",
    role: "assistant",
    content:
      "Real Madrid won the Champions League last year, defeating Borussia Dortmund in the final.",
  },
];

export const getMessages = (conversationId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(messages.filter((m) => m.conversationId === conversationId));
    }, 300);
  });
};

export const createMessage = (message) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMessage = { ...message, id: Date.now().toString() };
      messages.push(newMessage);
      resolve(newMessage);
    }, 300);
  });
};
