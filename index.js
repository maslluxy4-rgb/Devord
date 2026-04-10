const express = require("express");
const cors    = require("cors");
const app     = express();

app.use(cors());
app.use(express.json());

// In-memory store — messages reset if the server restarts
// Swap this for a DB (SQLite, Postgres, etc.) later if you want persistence
const messages = [];
let nextId = 1;

// GET /messages — return all messages
app.get("/messages", (req, res) => {
    res.json(messages);
});

// POST /messages — add a new message
app.post("/messages", (req, res) => {
    const { username, text } = req.body;
    if (!username || !text) {
        return res.status(400).json({ error: "username and text are required" });
    }
    const msg = { id: nextId++, username, text, ts: Date.now() };
    messages.push(msg);

    // Optional: cap at last 200 messages so memory doesn't grow forever
    if (messages.length > 200) messages.shift();

    res.status(201).json(msg);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Chat server running on port ${PORT}`));
