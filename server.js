const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// This stores your messages in the server's memory
let chatHistory = [];

// 1. The "Home" page (To check if the server is working)
app.get('/', (req, res) => {
    res.send("Devcord Backend is ONLINE 🚀");
});

// 2. The "Send" route (Roblox posts messages here)
app.post('/send', (req, res) => {
    const { username, content, time } = req.body;
    
    if (!username || !content) {
        return res.status(400).json({ error: "Missing data" });
    }

    const newMessage = {
        username: username,
        content: content,
        time: time,
        id: Date.now() // This helps Roblox know which messages are new
    };

    chatHistory.push(newMessage);

    // Keep only the last 50 messages so the server doesn't get slow
    if (chatHistory.length > 50) {
        chatHistory.shift();
    }

    console.log(`[@${username}]: ${content}`);
    res.status(200).json({ success: true });
});

// 3. The "Get" route (Roblox checks here for updates)
app.get('/messages', (req, res) => {
    res.json(chatHistory);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Devcord is running on port ${PORT}`);
});
