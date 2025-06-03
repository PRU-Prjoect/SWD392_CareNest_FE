import React, { useEffect, useState } from "react";
import type { PomodoroConfig } from "./PomodoroForm";

type TimerProps = {
  config: PomodoroConfig;
};

const PomodoroTimer: React.FC<TimerProps> = ({ config }) => {
  const [secondsLeft, setSecondsLeft] = useState(config.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState("làm việc");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => setSecondsLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  const formatTime = () => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(config.workDuration * 60);
    setPhase("làm việc");
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl px-8 py-10 max-w-xl mx-auto text-center space-y-8">
      <h2 className="text-3xl font-extrabold text-blue-700">⏱ Pomodoro Timer</h2>

      <div className="text-6xl font-mono font-bold text-gray-800 tracking-widest">
        {formatTime()}
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => setIsRunning(true)}
          className="px-6 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md transition"
        >
          ▶ Bắt đầu
        </button>
        <button
          onClick={() => setIsRunning(false)}
          className="px-6 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white font-semibold shadow-md transition"
        >
          ⏸ Tạm dừng
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md transition"
        >
          🔁 Reset
        </button>
      </div>

      <p className="text-gray-600 text-lg">
        🕓 Phiên hiện tại: <span className="font-semibold text-blue-800">{phase}</span>
      </p>
    </div>
  );
};

export default PomodoroTimer;
