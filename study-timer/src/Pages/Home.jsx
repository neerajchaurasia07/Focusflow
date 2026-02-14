import React from "react";
import Navbar from "../components/Navbar";
import Timer from "../components/Timer";
import TaskList from "../components/TaskList";
import StatsCard from "../components/StatsCard";
import WeeklyChart from "../components/WeeklyChart";
import { useEffect , useState } from "react";
import API from "../api/api";


export default function App() {
    const [homeStats, setHomeStats] = useState({ todayMinutes: 0, todaySessions: 0 });

useEffect(() => {
  API.get("/stats/today")
    .then(res => setHomeStats(res.data))
    .catch(err => console.error("Home today stats error:", err));
}, []);

return (
<div className="min-h-screen bg-gray-100 dark:bg-black transition-colors">
{/* <Navbar /> */}


<div className="px-6 pt-6 pb-20 max-w-6xl mx-auto">
{/* Timer Section */}
<section className="mb-10">
<Timer />
</section>


{/* Tasks + Stats Grid */}
<section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
<TaskList />
<div className="flex flex-col gap-6">
<StatsCard title="Today's Focus" value={`${homeStats.todayMinutes} mins`} />
<StatsCard title="Sessions Completed" value={homeStats.todaySessions} />
</div>
</section>


{/* Weekly Chart */}
<section>
<WeeklyChart />
</section>
</div>
</div>
);
} 