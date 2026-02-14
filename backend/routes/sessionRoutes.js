import express from "express";
import Session from "../models/Session.js";

const router = express.Router();

// GET /api/sessions - list sessions (most recent first)
router.get("/", async (req, res) => {
  try {
    const sessions = await Session.find().sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    console.error("GET /api/sessions error:", err);
    res.status(500).json({ message: "Error fetching sessions" });
  }
});

// POST /api/sessions - create a new session (duration in minutes)
router.post("/", async (req, res) => {
  try {
    const { duration, mode } = req.body;
    if (typeof duration !== "number") {
      return res.status(400).json({ message: "Duration (number) required" });
    }
    const session = await Session.create({ duration, mode });
    res.status(201).json(session);
  } catch (err) {
    console.error("POST /api/sessions error:", err);
    res.status(500).json({ message: "Error creating session" });
  }
});

// DELETE /api/sessions/:id - delete a session
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Session.findByIdAndDelete(id);
    res.json({ message: "Session deleted" });
  } catch (err) {
    console.error("DELETE /api/sessions/:id error:", err);
    res.status(500).json({ message: "Error deleting session" });
  }
});

export default router;
