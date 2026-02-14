import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import WeeklyChart from "../components/WeeklyChart";
import TaskList from "../components/TaskList";
import { useEffect , useState } from "react";
import API from "../api/api";

export default function Dashboard() {

  // Example: pull real values from context (later we’ll bind properly)

  const [stats, setStats] = useState({
  completedSessions: 0,
  totalMinutes: 0,
  completedTasks: 0,
  streak: 0,
});

useEffect(() => {
  API.get("/stats/summary")
    .then(res => setStats(res.data))
    .catch(err => console.error("Stats load error", err));
}, []);


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-all">
      {/* <Navbar /> */}

      <div className="max-w-6xl mx-auto pt-10 px-4">

        {/* ---- Title ---- */}
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">
          📊 Productivity Dashboard
        </h1>

        {/* ---- Stats Grid ---- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <StatsCard title="Focus Sessions" value={stats.completedSessions || 0} />
          <StatsCard title="Minutes Focused" value={stats.totalMinutes || 0} />
          <StatsCard title="Tasks Completed" value={stats.completedTasks || 0} />
          <StatsCard title="Streak 🔥" value={stats.streak ?? 0} />


        </div>

        {/* ---- Weekly Productivity Chart ---- */}
        <div className="mt-10 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Weekly Productivity Overview
          </h2>
          <WeeklyChart />
        </div>

        {/* ---- Completed Task History ---- */}
        <div className="mt-10 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Completed Tasks 📌
          </h2>
          <TaskList readOnly={true} />
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            *Tasks are read-only here. Manage them from Home Page.
          </p>
        </div>

      </div>
    </div>
  );
}
