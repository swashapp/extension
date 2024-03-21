import { LinearProgress } from "@mui/material";
import { withStyles } from "@mui/styles";
import { ReactNode, useEffect, useState } from "react";

import { getTimestamp } from "@/utils/date.util";

const MuiLinearProgress = withStyles(() => ({
  root: {
    height: 3,
    borderRadius: 12,
  },
  colorPrimary: {
    backgroundColor: " var(--color-white)",
  },
  bar: {
    borderRadius: 12,
    backgroundColor: "var(--color-green)",
  },
}))(LinearProgress);

function calculateProgress(start: number, end: number) {
  return ((getTimestamp() - start) * 100) / (end - start);
}

export function TimeProgressBar({
  start,
  end,
  onEnd,
}: {
  start: number;
  end: number;
  onEnd: () => void;
}): ReactNode {
  const [progress, setProgress] = useState<number>(
    calculateProgress(start, end),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const progress = calculateProgress(start, end);
      if (progress >= 100) onEnd();
      setProgress(progress);
    }, 200);
    return () => clearInterval(interval);
  }, [start, end, onEnd]);

  return (
    <MuiLinearProgress
      variant={"determinate"}
      value={progress < 100 ? progress : 100}
    />
  );
}
