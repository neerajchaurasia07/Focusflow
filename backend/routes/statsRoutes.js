import express from "express";
import Session from "../models/Session.js";
import Task from "../models/Task.js";

const router = express.Router();

async function calculateStreak() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;

  for (let i = 0; i < 100; i++) {
    const dayStart = new Date(today);
    dayStart.setDate(today.getDate() - i);

    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayStart.getDate() + 1);

    const sessions = await Session.find({
      createdAt: { $gte: dayStart, $lt: dayEnd }
    });

    if (sessions.length > 0) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}



// 📌 GET /api/stats/summary
router.get("/summary", async (req, res) => {
  try {
    const sessions = await Session.find();
    const completedTasks = await Task.countDocuments({ completed: true });

    const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const totalSessions = sessions.length;

    // Calculate streak = consecutive days with at least 1 session
    const streak = await calculateStreak();


    res.json({
      totalMinutes,
      completedSessions: totalSessions,
      completedTasks,
      streak,
    });
  } catch (err) {
    console.error("GET /api/stats/summary error:", err);
    res.status(500).json({ message: "Error fetching summary" });
  }
});


// 📌 GET /api/stats/today
router.get("/today", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todaySessions = await Session.find({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    const todayMinutes = todaySessions.reduce(
      (sum, s) => sum + (s.duration || 0),
      0
    );

    res.json({
      todayMinutes,
      todaySessions: todaySessions.length
    });

  } catch (err) {
    console.error("GET /api/stats/today error:", err);
    res.status(500).json({ message: "Error fetching today's stats" });
  }
});



/**
 * GET /api/stats/weekly
 * Returns last 7 days array: [{ date: 'YYYY-MM-DD', minutes }, ...]
 */
router.get("/weekly", async (req, res) => {
  try {
    const today = new Date();
    const weekData = [];

    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(today);
      dayStart.setHours(0, 0, 0, 0);
      dayStart.setDate(today.getDate() - i);

      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);

      const daySessions = await Session.find({
        createdAt: { $gte: dayStart, $lt: dayEnd }
      });

      const minutes = daySessions.reduce((sum, s) => sum + (s.duration || 0), 0);

      weekData.push({
        date: dayStart.toISOString().slice(0, 10),
        minutes
      });
    }

    res.json(weekData);
  } catch (err) {
    console.error("GET /api/stats/weekly error:", err);
    res.status(500).json({ message: "Error fetching weekly data" });
  }
});

export default router;
