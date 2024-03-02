import React, { useState, useEffect } from "react";

const useCountdown = (seconds = 30) => {
  const [remainingSeconds, setRemainingSeconds] = useState(seconds);
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);

  useEffect(() => {
    if (isCountdownRunning) {
      const interval = setInterval(() => {
        setRemainingSeconds((remainingSeconds) => remainingSeconds - 1);
      }, 1000);

      // Clear the interval when the countdown reaches zero or when the component unmounts
      return () => {
        clearInterval(interval);
        if (remainingSeconds === 0) {
          setIsCountdownRunning(false);
          setRemainingSeconds(seconds);
        }
      };
    }
  }, [isCountdownRunning, remainingSeconds]);

  const startCountdown = () => {
    if(!isCountdownRunning)
      setIsCountdownRunning(true);
  };

  return {
    remainingSeconds,
    isCountdownRunning,
    startCountdown,
  };
};

export default useCountdown;
