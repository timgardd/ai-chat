export class ChatMessage extends HTMLElement {
  connectedCallback() {
    // Only render once so we don't overwrite streamed chunks if moved
    if (this.hasRendered) return;
    this.hasRendered = true;

    const role = this.getAttribute("role");
    const content = this.getAttribute("content") || "";

    const isUser = role === "user";
    const containerClasses = isUser ? "flex justify-end" : "flex justify-start";
    const bubbleClasses = isUser
      ? "bg-blue-600 text-white rounded-2xl rounded-br-sm"
      : "bg-gray-800 text-gray-200 rounded-2xl rounded-bl-sm border border-gray-700";

    this.innerHTML = `
      <div class="${containerClasses} w-full mb-4">
        <div class="max-w-[75%] px-4 py-2.5 shadow-sm ${bubbleClasses}">
          <p class="text-sm md:text-base whitespace-pre-wrap leading-relaxed">${content}</p>
        </div>
      </div>
    `;
  }
}

customElements.define("chat-message", ChatMessage);

const messagesContainer = document.getElementById("messages");

export function appendUserMessage(text) {
  const msgElement = document.createElement("chat-message");
  msgElement.setAttribute("role", "user");
  msgElement.setAttribute("content", text);
  messagesContainer.appendChild(msgElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

export function createAssistantMessage() {
  const msgElement = document.createElement("chat-message");
  msgElement.setAttribute("role", "ai");
  msgElement.setAttribute("content", "");
  messagesContainer.appendChild(msgElement);

  const textElement = msgElement.querySelector("p");

  return {
    appendChunk: (textChunk) => {
      textElement.textContent += textChunk;
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },
  };
}
