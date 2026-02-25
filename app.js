class ChatMessage extends HTMLElement {
  connectedCallback() {
    const role = this.getAttribute("role");
    const content = this.getAttribute("content");

    const isUser = role === "user";
    const containerClasses = isUser ? "flex justify-end" : "flex justify-start";
    const bubbleClasses = isUser
      ? "bg-blue-600 text-white rounded-2xl rounded-br-sm"
      : "bg-gray-800 text-gray-200 rounded-2xl rounded-bl-sm border border-gray-700";

    this.innerHTML = `
      <div class="${containerClasses} w-full mb-4">
        <div class="max-w-[75%] px-4 py-2.5 shadow-sm ${bubbleClasses}">
          <p class="text-sm md:text-base whitespace-pre-wrap">${content}</p>
        </div>
      </div>
    `;
  }
}

customElements.define("chat-message", ChatMessage);

const messagesContainer = document.getElementById("messages");

const initialMessages = [
  {
    role: "user",
    content:
      "Hey, can you recommend some good sci-fi movies that came out in the last 5 years?",
  },
  {
    role: "ai",
    content:
      "Absolutely! If you're looking for recent sci-fi, I'd highly recommend *Dune: Part One* (2021) and *Part Two* (2024) for epic world-building. If you prefer something more mind-bending and smaller scale, *Everything Everywhere All at Once* (2022) is fantastic.",
  },
  {
    role: "user",
    content:
      "Oh, I've seen Dune, it was amazing! What about Everything Everywhere All at Once? What's it about?",
  },
  {
    role: "ai",
    content:
      "It's a wild ride! It follows a Chinese-American immigrant who discovers that she must connect with parallel universe versions of herself to prevent a powerful being from destroying the multiverse. It blends martial arts, family drama, and absurd comedy.",
  },
];

initialMessages.forEach((msg) => {
  const msgElement = document.createElement("chat-message");
  msgElement.setAttribute("role", msg.role);
  msgElement.setAttribute("content", msg.content);
  messagesContainer.appendChild(msgElement);
});

const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");

function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  const msgElement = document.createElement("chat-message");
  msgElement.setAttribute("role", "user");
  msgElement.setAttribute("content", text);

  messagesContainer.appendChild(msgElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  messageInput.value = "";
}

sendBtn.addEventListener("click", sendMessage);

messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});
