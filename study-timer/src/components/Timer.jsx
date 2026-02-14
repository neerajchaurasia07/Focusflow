
import formatTime from "../utils/formatTime";
import { useTimer } from "../context/TimerContext";

export default function Timer() {
  const { mode, 
    timeLeft, 
    isRunning, 
    start, 
    pause, 
    reset, 
    progress,
    isLoaded
  } = useTimer();

   if (!isLoaded) {
    return (
      <div className="p-10 text-center text-xl text-gray-500 dark:text-gray-300">
        Loading timer...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-900 p-10 rounded-2xl shadow-xl transition-all">
       <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        {mode === "work" ? "Pomodoro" : mode === "shortBreak" ? "Short Break" : "Long Break"}
      </h2>
      {/* Mode Selector */}
<div className="flex gap-4 mb-6">
  <button
    onClick={() => reset("work")}
    className={`px-4 py-2 rounded-xl ${
      mode === "work"
        ? "bg-blue-600 text-white"
        : "bg-gray-300 dark:bg-gray-700 dark:text-white"
    }`}
  >
    Work
  </button>

  <button
    onClick={() => reset("shortBreak")}
    className={`px-4 py-2 rounded-xl ${
      mode === "shortBreak"
        ? "bg-blue-600 text-white"
        : "bg-gray-300 dark:bg-gray-700 dark:text-white"
    }`}
  >
    Short Break
  </button>

  <button
    onClick={() => reset("longBreak")}
    className={`px-4 py-2 rounded-xl ${
      mode === "longBreak"
        ? "bg-blue-600 text-white"
        : "bg-gray-300 dark:bg-gray-700 dark:text-white"
    }`}
  >
    Long Break
  </button>
</div>


      {/* Progress Ring */}
      <div className="relative w-60 h-60 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#3b82f6"
            strokeWidth="8"
            fill="none"
            strokeDasharray={Math.PI * 2 * 45}
            strokeDashoffset={(Math.PI * 2 * 45 * (100 - progress)) / 100}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>

        {/* Time Display */}
        <span className="absolute text-6xl font-semibold text-gray-800 dark:text-white">
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={isRunning ? pause : start}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg shadow-md transition-all"
        >
          {isRunning ? "Pause" : "Start"}
        </button>

        <button
          onClick={reset}
          className="px-6 py-2 bg-gray-300 dark:bg-gray-700 dark:text-white rounded-xl text-lg shadow-md hover:opacity-80 transition-all"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
