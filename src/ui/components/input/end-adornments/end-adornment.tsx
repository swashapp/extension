import { InputAdornment } from "@mui/material";
import clsx from "clsx";
import { ReactNode } from "react";

import styles from "./end-adornment.module.css";

export function EndAdornment({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): ReactNode {
  return (
    <InputAdornment
      className={clsx("absolute", styles.container, className)}
      position={"end"}
    >
      {children}
    </InputAdornment>
  );
}
