import { InputAdornment } from "@mui/material";
import clsx from "clsx";
import { ReactNode } from "react";

import styles from "./end-adornment.module.css";

export function EndAdornment({ children }: { children: ReactNode }): ReactNode {
  return (
    <InputAdornment
      className={clsx("absolute", styles.container)}
      position={"end"}
    >
      {children}
    </InputAdornment>
  );
}
