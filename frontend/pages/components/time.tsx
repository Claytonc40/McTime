import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import PlayButton from "./playButton";

interface TimeProps {
  cronometroId: React.Key | null | undefined;
  initialTime: number;
}

const Time: React.FC<TimeProps> = ({ cronometroId, initialTime }) => {
  const [seconds, setSeconds] = useState(initialTime);
  const [isPaused, setIsPaused] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/cronometros/${cronometroId}`
        );
        const data = await response.json();

        if (data) {
          const elapsedTime = Math.floor(
            (Date.now() - new Date(data.startTime).getTime()) / 1000
          );
          const remainingSeconds = Math.max(initialTime - elapsedTime, 0);
          setSeconds(remainingSeconds);
          setIsPaused(data.isPaused);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do cronômetro:", error);
      }
    };

    fetchData();
  }, [cronometroId, initialTime]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (!isPaused) {
      intervalId = setInterval(async () => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 0) {
            clearInterval(intervalId);
            setIsPaused(true);
            // Lógica a ser executada quando o tempo atingir zero.
          }

          // Atualizar dados no banco de dados a cada segundo
          const timestamp = Date.now();
          fetch(`http://localhost:3001/api/cronometros/${cronometroId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              seconds: prevSeconds,
              startTime: new Date(timestamp).toISOString(),
              isPaused: false, // Alterado para false quando o cronômetro está em execução
            }),
          });

          return prevSeconds > 0 ? prevSeconds - 1 : 0;
        });
      }, 1000);
    } else if (intervalId) {
      clearInterval(intervalId);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPaused, cronometroId]);

  const togglePause = () => {
    setIsPaused(!isPaused);

    // Atualizar dados no banco de dados ao pausar ou retomar o cronômetro
    fetch(`http://localhost:3001/api/cronometros/${cronometroId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        seconds,
        startTime: new Date().toISOString(),
        isPaused: !isPaused,
      }),
    });
  };

  const resetTimer = () => {
    setSeconds(initialTime);
    setIsPaused(true);

    // Limpar dados no banco de dados ao redefinir o cronômetro
    fetch(`http://localhost:3001/api/cronometros/${cronometroId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        seconds: initialTime,
        startTime: new Date().toISOString(),
        isPaused: true,
      }),
    });
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div className="flex items-center  text-center">
      <div className="mr-4">
        <CircularProgressbar
          className="w-10 h-20"
          value={(initialTime - seconds) * (100 / initialTime)}
          text={formatTime(seconds)}
          styles={buildStyles({
            strokeLinecap: "butt",
            textColor: "#fff",
            pathColor: isPaused ? "#f54e4e" : "#4aec8c",
            trailColor: "rgba(255,255,255,.2)",
          })}
        />
      </div>
      <div>
        {isPaused ? (
          <PlayButton onClick={togglePause} className="mr-2 hover:opacity-20" />
        ) : (
          <PlayButton
            onClick={togglePause}
            className="mr-2 opacity-50 cursor-not-allowed"
            disabled
          />
        )}
      </div>
    </div>
  );
};

export default Time;
