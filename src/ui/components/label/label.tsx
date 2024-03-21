import { FormControl } from "@mui/material";
import clsx from "clsx";
import { ReactNode } from "react";
import { PropsWithChildren } from "react";

import styles from "./label.module.css";

export function Label(
  props: PropsWithChildren<{
    id: string;
    children: ReactNode;
    text: string;
    shrink?: boolean | undefined;
  }>,
): ReactNode {
  return (
    <FormControl className={styles.container}>
      <div className={"flex col gap4"}>
        <p className={clsx("bold", styles.text)}>{props.text}</p>
        {props.children}
      </div>
    </FormControl>
  );
}
