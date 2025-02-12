import { CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReactNode } from "react";

const ProgressWrapper = styled("div")(() => ({
  height: 50,
  position: "relative",
}));

const StyledCircularProgress = styled(CircularProgress)(() => ({
  color: "var(--color-green)",
  animationDuration: "1s",
  position: "absolute",
  left: "calc(50% - 25px)",
  "& .MuiCircularProgress-circle": {
    strokeLinecap: "round",
  },
}));

export function WaitingProgressBar({
  showText = true,
}: {
  showText?: boolean;
}): ReactNode {
  return (
    <div className="relative round flex col gap12 text-center">
      <ProgressWrapper>
        <StyledCircularProgress
          variant="indeterminate"
          disableShrink
          size={50}
          thickness={4}
        />
      </ProgressWrapper>
      {showText && <p>Waiting...</p>}
    </div>
  );
}
