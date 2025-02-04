require("dotenv").config(); // Load environment variables

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const Message = require("./models/message_model");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Use environment variable for MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));


io.on("connection", async (socket) => {
    console.log("A user connected");
    
    // Load previous messages
    const messages = await Message.find().sort({ createdAt: 1 });
    socket.emit("loadMessages", messages);
    
    socket.on("sendMessage", async (data) => {
        const newMessage = new Message({ username: data.username, message: data.message });
        await newMessage.save();
        io.emit("receiveMessage", data);
    });
    
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

// Use PORT from .env, fallback to 3000 if not set
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
