const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const messages = document.getElementById("messages");

function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  const message = document.createElement("div");
  message.classList.add("message", "user");
  message.textContent = text;

  messages.appendChild(message);

  // Scroll to bottom
  messages.scrollTop = messages.scrollHeight;

  messageInput.value = "";
}

sendBtn.addEventListener("click", sendMessage);

messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});
