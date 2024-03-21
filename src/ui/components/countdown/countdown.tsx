import clsx from "clsx";
import { useState, useEffect } from "react";

export function Countdown({
  minutes,
  seconds,
  className,
  onOver,
}: {
  minutes: number;
  seconds: number;
  className?: string;
  onOver?: () => void;
}) {
  const [time, setTime] = useState({
    minutes,
    seconds,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        let { minutes, seconds } = prevTime;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else {
          clearInterval(timer);
          onOver && onOver();
        }

        return { minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onOver]);

  return (
    <span className={clsx(className)}>
      {String(time.minutes).padStart(2, "0")}:
      {String(time.seconds).padStart(2, "0")}
    </span>
  );
}
