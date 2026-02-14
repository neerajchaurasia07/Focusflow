import { createContext, useContext, useEffect, useRef, useState } from "react";
import API from "../api/api";

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const defaultConfig = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  const [mode, setMode] = useState(() => localStorage.getItem("mode") || "work");
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem("timeLeft");
    return saved ? Number(saved) : defaultConfig.work;
  });

  const [isRunning, setIsRunning] = useState(false);

  const [targetEnd, setTargetEnd] = useState(() =>
    Number(localStorage.getItem("targetEnd")) || null
  );

  const [isLoaded, setIsLoaded] = useState(false); 

  const sessionCount = useRef(0);

  // --- NEW: Track stats ---
  const [completedSessions, setCompletedSessions] = useState(() =>
    Number(localStorage.getItem("completedSessions") || 0)
  );

  const [totalFocusMinutes, setTotalFocusMinutes] = useState(() =>
    Number(localStorage.getItem("totalFocusMinutes") || 0)
  );

  // Save state
  useEffect(() => {
    localStorage.setItem("mode", mode);
     localStorage.setItem("timeLeft", timeLeft);
    localStorage.setItem("completedSessions", completedSessions);
    localStorage.setItem("totalFocusMinutes", totalFocusMinutes);
  }, [mode, timeLeft ,completedSessions, totalFocusMinutes]);

 useEffect(() => {
    if (!targetEnd) {
      setIsLoaded(true);
      return;
    }

    const left = Math.floor((targetEnd - Date.now()) / 1000);
    setTimeLeft(left > 0 ? left : 0);

    setIsLoaded(true);
  }, []);

  // Countdown effect
   useEffect(() => {
    if (!isRunning || !targetEnd) return;

    const interval = setInterval(() => {
      const left = Math.floor((targetEnd - Date.now()) / 1000);

      if (left <= 0) {
        setTimeLeft(0);
        setIsRunning(false);
        setTargetEnd(null);
        localStorage.removeItem("targetEnd");
        handleCompletion();
      } else {
        setTimeLeft(left);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetEnd]);

 const handleCompletion = () => {
    if (mode === "work") {
      setCompletedSessions((prev) => prev + 1);
      setTotalFocusMinutes((prev) => prev + defaultConfig.work / 60);

      API.post("/sessions", {
        duration: defaultConfig.work / 60,
        mode: "work",
        completedAt: new Date(),
      }).catch((err) => console.error("Failed to push stats", err));

      sessionCount.current += 1;

      if (sessionCount.current % 4 === 0) {
        setMode("longBreak");
        setTimeLeft(defaultConfig.longBreak);
      } else {
        setMode("shortBreak");
        setTimeLeft(defaultConfig.shortBreak);
      }
    } else {
      setMode("work");
      setTimeLeft(defaultConfig.work);
    }
  };

 // ⭐ FIXED START — stores future end time
  const start = () => {
    const endTime = Date.now() + timeLeft * 1000;
    setTargetEnd(endTime);
    localStorage.setItem("targetEnd", endTime);
    setIsRunning(true);
  };

  // ⭐ FIXED PAUSE
  const pause = () => {
    setIsRunning(false);
    setTargetEnd(null);
    localStorage.removeItem("targetEnd");
  };


const reset = (newMode = mode) => {
  const safeMode = defaultConfig[newMode] ? newMode : "work";

  setIsRunning(false);
  setTargetEnd(null);
  localStorage.removeItem("targetEnd");

  setMode(safeMode);
  setTimeLeft(defaultConfig[safeMode]);
};


  const total = defaultConfig[mode] ?? defaultConfig.work;
const safeTime = Number.isFinite(timeLeft) ? timeLeft : total;

const progress = Math.min(
  100,
  Math.max(0, (1 - safeTime / total) * 100)
);

  return (
    <TimerContext.Provider
      value={{
        mode,
        timeLeft,
        isRunning,
        start,
        pause,
        reset,
        progress,
        completedSessions,
        totalFocusMinutes,
        isLoaded
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);
