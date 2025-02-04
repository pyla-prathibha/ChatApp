const socket = io();

const chatBox = document.getElementById("chat-box");
const usernameInput = document.getElementById("username");
const messageInput = document.getElementById("message");

function sendMessage() {
    const username = usernameInput.value.trim();
    const message = messageInput.value.trim();
    
    if (username === "" || message === "") return;
    
    socket.emit("sendMessage", { username, message });
    messageInput.value = "";
}


socket.on("receiveMessage", (data) => {
    const messageElement = document.createElement("div");
    messageElement.textContent = `${data.username}: ${data.message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
});

socket.on("loadMessages", (messages) => {
    chatBox.innerHTML = "";
    messages.forEach((data) => {
        const messageElement = document.createElement("div");
        messageElement.textContent = `${data.username}: ${data.message}`;
        chatBox.appendChild(messageElement);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
});
