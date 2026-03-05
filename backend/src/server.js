// Basic setup
// ========================================================================================================

const express = require("express");
const cors = require("cors");

const { readDb, writeDb } = require("./db");

const app = express();
const PORT = process.env.PORT || 8000

// CORS middleware to allow frontend to access backend
app.use(cors());
app.use(express.json());

// This just to make sure server is running and works in browser
app.get("/", (req, res) => {
  res.send("Pomodoro backend running!");
});

// ========================================================================================================
// Reward mapping helper
function rewardForFocusMinutes(minutes) {
  const map = {
    30: "mango",
    45: "orange",
    1: "strawberry",
  };
  return map[minutes];
}

// ========================================================================================================
// ENDPOINT: Complete a focus session → earn reward
app.post("/api/focus-sessions", (req, res) => {
  const reward = rewardForFocusMinutes(req.body.focusMinutes);
  if (!reward) {
    return res.status(400).json({
      error: "Invalid focusMinutes. Use 30, 45, or 60.",
    });
  }

  const db = readDb();
  db.rewards.push({
    reward, // "mango" | "orange" | "strawberry"
    earnedAt: Date.now(), // timestamp for ordering
  });
  writeDb(db);

  res.json({ reward });
});

// ========================================================================================================
// ENDPOINT: View your gallery of rewards
app.get("/api/rewards", (req, res) => {
  const db = readDb();
  res.json({ rewards: db.rewards });
});

// ========================================================================================================
// ENDPOINT: Reset for demo purposes
app.post("/api/reset", (req, res) => {
  const db = readDb();
  db.rewards = [];
  writeDb(db);
  res.json({ ok: true });
});

// ========================================================================================================
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
