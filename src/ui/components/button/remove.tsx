import clsx from "clsx";
import { ReactNode, SyntheticEvent } from "react";

import styles from "./remove.module.css";

export function RemoveButton({
  onClick,
}: {
  onClick: (e: SyntheticEvent) => void;
}): ReactNode {
  return (
    <div
      onClick={onClick}
      className={clsx("flex row align-center", styles.button)}
    >
      <div className={styles.icon}>
        <img
          width={16}
          height={16}
          src={"/images/shape/remove.svg"}
          alt={"-"}
        />
      </div>
      <p className={`small ${styles.text}`}>Remove</p>
    </div>
  );
}
