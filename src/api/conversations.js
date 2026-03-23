// Mock database for conversations
let conversations = [
  { id: "1", title: "Great Sci-Fi Movies", date: new Date().toISOString() },
  { id: "2", title: "Football Highlights", date: new Date().toISOString() },
];

export const getConversations = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...conversations]);
    }, 300); // simulate network delay
  });
};
