import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import PlayButton from "./playButton";
import PauseButton from "./pauseButton";
import ResetButton from "./resetButton";

const green = "#4aec8c";
const red = "#f54e4e";

export default function Time() {
  const initialTime = 65 * 60;
  const [seconds, setSeconds] = useState(initialTime);
  const [isPaused, setIsPaused] = useState(true);
  const [startTime, setStartTime] = useState<string | null>(null);

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;

    if (!isPaused) {
      interval = setInterval(() => {
        setSeconds((prevSeconds: number) => {
          const newSeconds = prevSeconds - 1;

          if (newSeconds === 0) {
            // Ação quando o tempo chegar a zero
          }

          return newSeconds;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isPaused]);

  const togglePause = () => {
    if (isPaused) {
      setStartTime(new Date().toLocaleTimeString()); // Armazenar a hora de início quando o relógio é iniciado
    }
    setIsPaused(!isPaused);
  };

  const resetTimer = () => {
    setSeconds(initialTime);
    setIsPaused(true);
    setStartTime(null); // Resetar a hora de início ao pressionar o botão de reset
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center  text-center">
      <div className="mr-4">
        <CircularProgressbar
          className="w-10 h-14"
          value={(initialTime - seconds) * (100 / initialTime)}
          text={formatTime(seconds)}
          styles={buildStyles({
            strokeLinecap: "butt",
            textColor: "#fff",
            pathColor: isPaused ? red : green,
            trailColor: "rgba(255,255,255,.2)",
          })}
        />
      </div>
      <div>
        {isPaused ? (
          <PlayButton onClick={togglePause} className="mr-2" />
        ) : (
          <PauseButton onClick={togglePause} className="mr-2" />
        )}
        <ResetButton onClick={resetTimer} />
       
      </div>
      {startTime && (
          <div className="m-4 text-sm text-gray-500">{startTime}</div>
        )}
    </div>
  );
}
