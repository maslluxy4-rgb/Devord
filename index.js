const express = require("express");
const cors    = require("cors");
const app     = express();

app.use(cors());
app.use(express.json());

// ── Bad word filter (basic list, extend as needed) ───────────
const BAD_WORDS = [
    "nigger","nigga","faggot","retard","cunt","chink","spic","kike","tranny"
];
function containsBadWord(text) {
    const lower = text.toLowerCase();
    return BAD_WORDS.some(w => lower.includes(w));
}

// ── Slowmode: track last message time per user ───────────────
const lastMessageTime = {};
const SLOWMODE_MS = 1000; // 1 second

const messages = [];
let nextId = 1;

// GET /messages
app.get("/messages", (req, res) => {
    res.json(messages);
});

// POST /messages
app.post("/messages", (req, res) => {
    const { username, text, userId } = req.body;
    if (!username || !text) {
        return res.status(400).json({ error: "username and text are required" });
    }

    // Slowmode check
    const now = Date.now();
    if (lastMessageTime[username] && (now - lastMessageTime[username]) < SLOWMODE_MS) {
        return res.status(429).json({ error: "Slow down! 1 second cooldown." });
    }

    // Bad word filter
    if (containsBadWord(text)) {
        return res.status(400).json({ error: "Message contains disallowed content." });
    }

    lastMessageTime[username] = now;

    const msg = {
        id: nextId++,
        username,
        userId: userId || 0,
        text: text.substring(0, 300), // cap message length
        ts: now
    };
    messages.push(msg);
    if (messages.length > 200) messages.shift();

    res.status(201).json(msg);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Devcord backend running on port ${PORT}`));
