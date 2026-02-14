import { useState , useEffect } from "react";
import API from "../api/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const WeeklyChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
  API.get("/stats/weekly")
    .then(res => setData(res.data))
    .catch(err => console.error("Weekly stats error", err));
}, []);


  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 w-full">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Weekly Productivity
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-40" />
          <XAxis
            dataKey="date"
            stroke="#888"
            tick={{ fill: "#555" }}
          />
          <YAxis
            stroke="#888"
            tick={{ fill: "#555" }}
            domain={[0, "dataMax+50"]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              color: "#fff",
              borderRadius: "10px",
              border: "none",
            }}
          />
          <Line
            type="monotone"
            dataKey="minutes"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ r: 5, strokeWidth: 2 }}
            activeDot={{ r: 7 }}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyChart;
