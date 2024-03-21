import { CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ReactNode } from "react";

const useStyles = makeStyles(() => ({
  root: {
    position: "relative",
  },
  div: {
    height: 50,
  },
  loading: {
    color: "var(--color-green)",
    animationDuration: "1s",
    position: "absolute",
    left: "calc(50% - 25px)",
  },
  circle: {
    strokeLinecap: "round",
  },
}));

export function WaitingProgressBar({
  showText = true,
}: {
  showText?: boolean;
}): ReactNode {
  const classes = useStyles();
  return (
    <div className={"relative round flex col gap12 text-center"}>
      <div className={classes.div}>
        <CircularProgress
          variant={"indeterminate"}
          disableShrink
          className={classes.loading}
          classes={{
            circle: classes.circle,
          }}
          size={50}
          thickness={4}
        />
      </div>
      {showText ? <p>Waiting...</p> : null}
    </div>
  );
}
