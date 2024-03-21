import clsx from "clsx";
import { ReactNode } from "react";

import styles from "./punched-box.module.css";

export function PunchedBox({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}): ReactNode {
  return (
    <div className={clsx("round no-overflow", styles.container, className)}>
      {children}
    </div>
  );
}
