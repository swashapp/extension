import clsx from "clsx";
import { ReactNode } from "react";

import { EndAdornment } from "@/ui/components/input/end-adornments/end-adornment";

import styles from "./text-end-adornment.module.css";

export function TextEndAdornment({
  text,
  disabled,
  className,
  onClick,
}: {
  text: string;
  disabled?: boolean;
  className?: string;
  onClick: () => void;
}): ReactNode {
  return (
    <EndAdornment className={className}>
      <p
        className={clsx("pointer", styles.text, { [styles.active]: !disabled })}
        onClick={onClick}
      >
        {text}
      </p>
    </EndAdornment>
  );
}
