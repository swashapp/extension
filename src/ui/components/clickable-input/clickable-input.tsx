import { CircularProgress } from "@mui/material";
import clsx from "clsx";
import { ReactNode } from "react";

import styles from "./clickable-input.module.css";

export function ClickableInput({
  label,
  placeholder,
  value,
  loading,
  onClick,
}: {
  label: string;
  placeholder: ReactNode;
  value?: string;
  loading?: boolean;
  onClick: () => void;
}): ReactNode {
  return (
    <div className={clsx("flex col gap4 border-box", styles.container)}>
      <p className={"bold"}>{label}</p>
      <div
        className={clsx(
          "flex nowrap justify-between align-center",
          styles.input,
        )}
        onClick={onClick}
      >
        {loading ? (
          <CircularProgress color={"inherit"} size={16} />
        ) : (
          <>
            <p className={"flex align-center gap4"}>{value ?? placeholder}</p>
            <img
              className={styles.action}
              src={"/images/shape/small-arrow.svg"}
              width={16}
              height={8}
              alt={"next"}
            />
          </>
        )}
      </div>
    </div>
  );
}
