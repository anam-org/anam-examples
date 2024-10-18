"use client";

import { useState, useEffect } from "react";

/**
 * Hook for managing a countdown timer with streaming stop logic.
 */
export const useStreamTimer = (
  initialTimeLeft: number,
  stopStreaming: () => void,
): [number, number] => {
  const [timeLeft, setTimeLeft] = useState<number>(initialTimeLeft);

  useEffect(() => {
    if (timeLeft === 0) {
      stopStreaming();
    }

    const timer =
      timeLeft > 0
        ? setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
        : undefined;

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft, stopStreaming]);

  const progressValue = ((initialTimeLeft - timeLeft) / initialTimeLeft) * 100;

  return [timeLeft, progressValue];
};
