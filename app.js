const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const messages = document.getElementById("messages");

sendBtn.addEventListener("click", () => {
  const text = messageInput.value.trim();
  if (!text) return;

  const message = document.createElement("div");
  message.classList.add("message", "user");
  message.textContent = text;

  messages.appendChild(message);

  messageInput.value = "";
});
