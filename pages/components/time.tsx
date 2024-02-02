import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import PlayButton from "./playButton";
import PauseButton from "./pauseButton";
import ResetButton from "./resetButton";

const green = "#4aec8c";
const red = "#f54e4e";

export default function Time() {
  const initialTime = 65 * 60; // Alterado para 5 segundos para teste
  const [seconds, setSeconds] = useState(initialTime);
  const [isPaused, setIsPaused] = useState(true);
  const [audio] = useState(new Audio("/songs/despertado.mp3")); // Caminho relativo à pasta public

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;

    if (!isPaused) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          const newSeconds = prevSeconds - 1;

          if (newSeconds === 0) {
            audio.play();
            
          }

          return newSeconds;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
      // Parar o som ao desmontar o componente
      audio.pause();
      audio.currentTime = 0;
    };
  }, [isPaused, audio]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const resetTimer = () => {
    setSeconds(initialTime);
    setIsPaused(true);
    // Parar o som ao pressionar o botão de reset
    audio.pause();
    audio.currentTime = 0;
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center">
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
    </div>
  );
}