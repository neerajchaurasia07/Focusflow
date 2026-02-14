import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

// GET /api/tasks - list all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error("GET /api/tasks error:", err);
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// POST /api/tasks - create a new task
router.post("/", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Task text is required" });
    }

    const task = await Task.create({ text: text.trim() });
    res.status(201).json(task);
  } catch (err) {
    console.error("POST /api/tasks error:", err);
    res.status(500).json({ message: "Error creating task" });
  }
});

// PATCH /api/tasks/:id - update (toggle or edit)
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Task.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Task not found" });
    res.json(updated);
  } catch (err) {
    console.error("PATCH /api/tasks/:id error:", err);
    res.status(500).json({ message: "Error updating task" });
  }
});

// DELETE /api/tasks/:id - delete a task
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("DELETE /api/tasks/:id error:", err);
    res.status(500).json({ message: "Error deleting task" });
  }
});

export default router;
